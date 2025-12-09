"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwentyCrmApi = void 0;
class TwentyCrmApi {
    constructor() {
        this.name = 'twentyCrmApi';
        this.displayName = 'Twenty CRM API';
        this.documentationUrl = 'https://twenty.com/developers/section/api-and-webhooks/api';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: 'https://api.twenty.com',
                placeholder: 'https://your-instance.twenty.com',
                description: 'The URL of your Twenty CRM instance',
                required: true,
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'API Key generated from your Twenty CRM instance',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.apiUrl}}',
                url: '/rest/metadata/objects',
                method: 'GET',
            },
        };
    }
}
exports.TwentyCrmApi = TwentyCrmApi;
//# sourceMappingURL=TwentyCrmApi.credentials.js.map