import { SIEMEvent, ElasticSearchConfig, SplunkConfig } from '../types/integrations';

export class SIEMIntegration {
  private elasticConfig?: ElasticSearchConfig;
  private splunkConfig?: SplunkConfig;

  constructor(elasticConfig?: ElasticSearchConfig, splunkConfig?: SplunkConfig) {
    this.elasticConfig = elasticConfig;
    this.splunkConfig = splunkConfig;
  }

  async sendToElastic(event: SIEMEvent): Promise<boolean> {
    if (!this.elasticConfig) return false;

    try {
      console.log('Sending to Elasticsearch:', event);

      const response = await fetch(`${this.elasticConfig.node}/security-events/_doc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.elasticConfig.auth ?
            `Basic ${btoa(`${this.elasticConfig.auth.username}:${this.elasticConfig.auth.password}`)}` : ''
        },
        body: JSON.stringify({
          '@timestamp': new Date(event.timestamp).toISOString(),
          source: event.source,
          severity: event.severity,
          category: event.category,
          message: event.message,
          raw_data: event.raw_data
        }),
        signal: AbortSignal.timeout(10000),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send to Elasticsearch:', error);
      return false;
    }
  }

  async sendToSplunk(event: SIEMEvent): Promise<boolean> {
    if (!this.splunkConfig) return false;

    try {
      console.log('Sending to Splunk:', event);

      const splunkEvent = {
        time: Math.floor(event.timestamp / 1000),
        host: typeof window !== 'undefined' ? window.location.hostname : 'server',
        source: this.splunkConfig.source,
        sourcetype: this.splunkConfig.sourcetype,
        index: this.splunkConfig.index,
        event: {
          severity: event.severity,
          category: event.category,
          message: event.message,
          ...event.raw_data
        }
      };

      const response = await fetch(`${this.splunkConfig.host}/services/collector/event`, {
        method: 'POST',
        headers: {
          'Authorization': `Splunk ${this.splunkConfig.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(splunkEvent),
        signal: AbortSignal.timeout(10000),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send to Splunk:', error);
      return false;
    }
  }

  async queryElastic(query: string, timeRange: { from: string; to: string }): Promise<any[]> {
    if (!this.elasticConfig) return [];

    try {
      const searchQuery = {
        query: {
          bool: {
            must: [
              { query_string: { query } },
              {
                range: {
                  '@timestamp': {
                    gte: timeRange.from,
                    lte: timeRange.to
                  }
                }
              }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'desc' } }],
        size: 100
      };

      const response = await fetch(`${this.elasticConfig.node}/security-events/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.elasticConfig.auth ?
            `Basic ${btoa(`${this.elasticConfig.auth.username}:${this.elasticConfig.auth.password}`)}` : ''
        },
        body: JSON.stringify(searchQuery),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();
      return data.hits?.hits?.map((hit: any) => hit._source) || [];
    } catch (error) {
      console.error('Failed to query Elasticsearch:', error);
      return [];
    }
  }

  generateSecurityEvent(
    source: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    category: string,
    message: string,
    rawData: any = {}
  ): SIEMEvent {
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source,
      severity,
      category,
      message,
      raw_data: rawData,
      indexed: false
    };
  }
}

export const siemIntegration = new SIEMIntegration();
