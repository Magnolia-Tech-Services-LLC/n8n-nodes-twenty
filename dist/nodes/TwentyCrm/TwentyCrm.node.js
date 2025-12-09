"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwentyCrm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class TwentyCrm {
    constructor() {
        this.description = {
            displayName: 'Twenty CRM',
            name: 'twentyCrm',
            icon: 'file:twenty.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Connect with Twenty CRM API - Enhanced by Magnolia Tech',
            defaults: {
                name: 'Twenty CRM',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'twentyCrmApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Company',
                            value: 'company',
                        },
                        {
                            name: 'Person',
                            value: 'person',
                        },
                        {
                            name: 'Opportunity',
                            value: 'opportunity',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                        {
                            name: 'Calendar Event',
                            value: 'calendarEvent',
                        },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Attachment',
                            value: 'attachment',
                        },
                        {
                            name: 'Workflow',
                            value: 'workflow',
                        },
                        {
                            name: 'Metadata',
                            value: 'metadata',
                            description: 'Access schema and metadata information',
                        },
                        {
                            name: 'Custom',
                            value: 'custom',
                        },
                    ],
                    default: 'person',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'company',
                                'person',
                                'opportunity',
                                'task',
                                'note',
                                'calendarEvent',
                                'message',
                                'attachment',
                                'workflow',
                                'custom',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a new record',
                            action: 'Create a record',
                        },
                        {
                            name: 'Create Many',
                            value: 'createMany',
                            description: 'Create multiple records in batch',
                            action: 'Create many records',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a record',
                            action: 'Delete a record',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a record by ID',
                            action: 'Get a record',
                        },
                        {
                            name: 'Get Many',
                            value: 'getAll',
                            description: 'Get many records',
                            action: 'Get many records',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update a record',
                            action: 'Update a record',
                        },
                        {
                            name: 'Upsert',
                            value: 'upsert',
                            description: 'Create or update a record based on match field',
                            action: 'Upsert a record',
                        },
                    ],
                    default: 'getAll',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['metadata'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Objects',
                            value: 'getObjects',
                            description: 'List all object types and their metadata',
                            action: 'Get all objects',
                        },
                        {
                            name: 'Get Object Schema',
                            value: 'getObjectSchema',
                            description: 'Get metadata for a specific object type',
                            action: 'Get object schema',
                        },
                        {
                            name: 'Get Field Metadata',
                            value: 'getFieldMetadata',
                            description: 'Get field definitions for an object',
                            action: 'Get field metadata',
                        },
                    ],
                    default: 'getObjects',
                },
                {
                    displayName: 'Object Name',
                    name: 'objectName',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g., people, companies, opportunities',
                    displayOptions: {
                        show: {
                            resource: ['metadata'],
                            operation: ['getObjectSchema', 'getFieldMetadata'],
                        },
                    },
                    description: 'Name of the object type (plural form)',
                },
                {
                    displayName: 'Match Field',
                    name: 'upsertMatchField',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['upsert'],
                        },
                    },
                    options: [
                        {
                            name: 'ID',
                            value: 'id',
                        },
                        {
                            name: 'Name (First + Last)',
                            value: 'name',
                        },
                        {
                            name: 'Email',
                            value: 'email',
                        },
                        {
                            name: 'Domain Name',
                            value: 'domainName',
                        },
                        {
                            name: 'Custom Field',
                            value: 'custom',
                        },
                    ],
                    default: 'name',
                    description: 'Field to match existing records on',
                },
                {
                    displayName: 'Custom Match Field',
                    name: 'customMatchField',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['upsert'],
                            upsertMatchField: ['custom'],
                        },
                    },
                    default: '',
                    description: 'Name of the custom field to match on',
                },
                {
                    displayName: 'Match Value',
                    name: 'upsertMatchValue',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['upsert'],
                        },
                    },
                    default: '',
                    description: 'Value to match against (for non-name fields)',
                },
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['get', 'update', 'delete'],
                        },
                    },
                    default: '',
                    description: 'ID of the record',
                },
                {
                    displayName: 'First Name',
                    name: 'firstName',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Last Name',
                    name: 'lastName',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    default: '',
                    placeholder: 'john@example.com',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Phone',
                    name: 'phone',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Job Title',
                    name: 'jobTitle',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'City',
                    name: 'city',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Company ID',
                    name: 'companyId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                    description: 'ID of the company to associate with this person',
                },
                {
                    displayName: 'LinkedIn URL',
                    name: 'linkedinUrl',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'X (Twitter) URL',
                    name: 'xUrl',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['person'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Company Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['company'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Domain',
                    name: 'domainName',
                    type: 'string',
                    default: '',
                    placeholder: 'example.com',
                    displayOptions: {
                        show: {
                            resource: ['company'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Employee Count',
                    name: 'employees',
                    type: 'number',
                    default: 0,
                    displayOptions: {
                        show: {
                            resource: ['company'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Address',
                    name: 'address',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['company'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'LinkedIn URL',
                    name: 'companyLinkedinUrl',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['company'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['task', 'note'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Body',
                    name: 'body',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['task', 'note'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Status',
                    name: 'status',
                    type: 'options',
                    options: [
                        {
                            name: 'To Do',
                            value: 'TODO',
                        },
                        {
                            name: 'In Progress',
                            value: 'IN_PROGRESS',
                        },
                        {
                            name: 'Done',
                            value: 'DONE',
                        },
                    ],
                    default: 'TODO',
                    displayOptions: {
                        show: {
                            resource: ['task'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Due Date',
                    name: 'dueAt',
                    type: 'dateTime',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['task'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Opportunity Name',
                    name: 'opportunityName',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['opportunity'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Amount',
                    name: 'amount',
                    type: 'number',
                    default: 0,
                    displayOptions: {
                        show: {
                            resource: ['opportunity'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Stage',
                    name: 'stage',
                    type: 'options',
                    options: [
                        {
                            name: 'New',
                            value: 'NEW',
                        },
                        {
                            name: 'Qualified',
                            value: 'QUALIFIED',
                        },
                        {
                            name: 'Proposal',
                            value: 'PROPOSAL',
                        },
                        {
                            name: 'Negotiation',
                            value: 'NEGOTIATION',
                        },
                        {
                            name: 'Won',
                            value: 'WON',
                        },
                        {
                            name: 'Lost',
                            value: 'LOST',
                        },
                    ],
                    default: 'NEW',
                    displayOptions: {
                        show: {
                            resource: ['opportunity'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Probability',
                    name: 'probability',
                    type: 'number',
                    default: 0,
                    typeOptions: {
                        minValue: 0,
                        maxValue: 100,
                    },
                    displayOptions: {
                        show: {
                            resource: ['opportunity'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Close Date',
                    name: 'closeDate',
                    type: 'dateTime',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['opportunity'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                },
                {
                    displayName: 'Custom Resource Name',
                    name: 'customResource',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g., blocklists, workflows, views',
                    displayOptions: {
                        show: {
                            resource: ['custom'],
                        },
                    },
                    description: 'Name of the custom resource (plural form)',
                },
                {
                    displayName: 'Fields JSON',
                    name: 'fieldsJson',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            resource: ['custom'],
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                    description: 'JSON object with field values',
                },
                {
                    displayName: 'Records JSON',
                    name: 'batchRecords',
                    type: 'json',
                    default: '[]',
                    displayOptions: {
                        show: {
                            operation: ['createMany'],
                        },
                    },
                    description: 'JSON array of records to create',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: ['getAll'],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['getAll'],
                            returnAll: [false],
                        },
                    },
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 50,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Additional Options',
                    name: 'additionalOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ['getAll'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Order By',
                            name: 'orderBy',
                            type: 'string',
                            default: '',
                            description: 'Field to order results by',
                        },
                        {
                            displayName: 'Order Direction',
                            name: 'orderDirection',
                            type: 'options',
                            options: [
                                {
                                    name: 'Ascending',
                                    value: 'ASC',
                                },
                                {
                                    name: 'Descending',
                                    value: 'DESC',
                                },
                            ],
                            default: 'ASC',
                        },
                        {
                            displayName: 'Filter JSON',
                            name: 'filter',
                            type: 'json',
                            default: '{}',
                            description: 'Filter query in JSON format',
                        },
                    ],
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update', 'upsert'],
                        },
                    },
                    description: 'Additional fields as JSON (for custom fields or relationships)',
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('twentyCrmApi');
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const resourceMap = {
            person: 'people',
            company: 'companies',
            opportunity: 'opportunities',
            task: 'tasks',
            note: 'notes',
            calendarEvent: 'calendarEvents',
            message: 'messages',
            attachment: 'attachments',
            workflow: 'workflows',
        };
        if (resource === 'metadata') {
            try {
                let responseData;
                const baseUrl = credentials.apiUrl;
                if (operation === 'getObjects') {
                    const options = {
                        method: 'GET',
                        uri: `${baseUrl}/rest/metadata/objects`,
                        json: true,
                    };
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', options);
                }
                if (operation === 'getObjectSchema') {
                    const objectName = this.getNodeParameter('objectName', 0);
                    const options = {
                        method: 'GET',
                        uri: `${baseUrl}/rest/metadata/objects/${objectName}`,
                        json: true,
                    };
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', options);
                }
                if (operation === 'getFieldMetadata') {
                    const objectName = this.getNodeParameter('objectName', 0);
                    const options = {
                        method: 'GET',
                        uri: `${baseUrl}/rest/metadata/objects/${objectName}/fields`,
                        json: true,
                    };
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', options);
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: 0 } });
                returnData.push(...executionData);
                return [returnData];
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message, resource, operation },
                        pairedItem: { item: 0 },
                    });
                    return [returnData];
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: 0 });
            }
        }
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                let endpoint = resourceMap[resource];
                if (resource === 'custom') {
                    endpoint = this.getNodeParameter('customResource', i);
                }
                const baseUrl = credentials.apiUrl;
                const options = {
                    method: 'GET',
                    uri: `${baseUrl}/rest/${endpoint}`,
                    json: true,
                };
                const buildPersonBody = (index) => {
                    const body = {};
                    const firstName = this.getNodeParameter('firstName', index, '');
                    const lastName = this.getNodeParameter('lastName', index, '');
                    if (firstName || lastName) {
                        body.name = {
                            firstName: firstName || '',
                            lastName: lastName || '',
                        };
                    }
                    const email = this.getNodeParameter('email', index, '');
                    if (email) {
                        body.emails = {
                            primaryEmail: email,
                            additionalEmails: [],
                        };
                    }
                    const phone = this.getNodeParameter('phone', index, '');
                    if (phone) {
                        body.phones = {
                            primaryPhoneNumber: phone,
                            primaryPhoneCountryCode: 'US',
                            additionalPhones: [],
                        };
                    }
                    const jobTitle = this.getNodeParameter('jobTitle', index, '');
                    if (jobTitle)
                        body.jobTitle = jobTitle;
                    const city = this.getNodeParameter('city', index, '');
                    if (city)
                        body.city = city;
                    const companyId = this.getNodeParameter('companyId', index, '');
                    if (companyId)
                        body.companyId = companyId;
                    const linkedinUrl = this.getNodeParameter('linkedinUrl', index, '');
                    if (linkedinUrl) {
                        body.linkedinLink = {
                            primaryLinkLabel: 'LinkedIn',
                            primaryLinkUrl: linkedinUrl,
                        };
                    }
                    const xUrl = this.getNodeParameter('xUrl', index, '');
                    if (xUrl) {
                        body.xLink = {
                            primaryLinkLabel: 'X',
                            primaryLinkUrl: xUrl,
                        };
                    }
                    return body;
                };
                const buildCompanyBody = (index) => {
                    const body = {};
                    body.name = this.getNodeParameter('name', index);
                    const domainName = this.getNodeParameter('domainName', index, '');
                    if (domainName) {
                        body.domainName = {
                            primaryLinkLabel: domainName,
                            primaryLinkUrl: `https://${domainName}`,
                        };
                    }
                    const employees = this.getNodeParameter('employees', index, 0);
                    if (employees > 0)
                        body.employees = employees;
                    const address = this.getNodeParameter('address', index, '');
                    if (address) {
                        body.address = {
                            addressStreet1: address,
                            addressCity: '',
                            addressCountry: '',
                        };
                    }
                    const linkedinUrl = this.getNodeParameter('companyLinkedinUrl', index, '');
                    if (linkedinUrl) {
                        body.linkedinLink = {
                            primaryLinkLabel: 'LinkedIn',
                            primaryLinkUrl: linkedinUrl,
                        };
                    }
                    return body;
                };
                if (operation === 'create') {
                    options.method = 'POST';
                    let body = {};
                    if (resource === 'person') {
                        body = buildPersonBody(i);
                    }
                    if (resource === 'company') {
                        body = buildCompanyBody(i);
                    }
                    if (resource === 'task') {
                        body.title = this.getNodeParameter('title', i);
                        const bodyText = this.getNodeParameter('body', i, '');
                        if (bodyText) {
                            body.bodyV2 = { markdown: bodyText };
                        }
                        body.status = this.getNodeParameter('status', i, 'TODO');
                        const dueAt = this.getNodeParameter('dueAt', i, '');
                        if (dueAt)
                            body.dueAt = dueAt;
                    }
                    if (resource === 'note') {
                        body.title = this.getNodeParameter('title', i);
                        const bodyText = this.getNodeParameter('body', i, '');
                        if (bodyText) {
                            body.bodyV2 = { markdown: bodyText };
                        }
                    }
                    if (resource === 'opportunity') {
                        body.name = this.getNodeParameter('opportunityName', i);
                        body.amount = this.getNodeParameter('amount', i, 0);
                        body.stage = this.getNodeParameter('stage', i, 'NEW');
                        body.probability = this.getNodeParameter('probability', i, 0);
                        const closeDate = this.getNodeParameter('closeDate', i, '');
                        if (closeDate)
                            body.closeDate = closeDate;
                    }
                    if (resource === 'custom') {
                        const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}');
                        try {
                            Object.assign(body, JSON.parse(fieldsJson));
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
                        }
                    }
                    const additionalFields = this.getNodeParameter('additionalFields', i, '{}');
                    try {
                        const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
                        Object.assign(body, additional);
                    }
                    catch (error) {
                    }
                    options.body = body;
                }
                if (operation === 'createMany') {
                    options.method = 'POST';
                    options.uri = `${baseUrl}/rest/${endpoint}/batch`;
                    const batchRecords = this.getNodeParameter('batchRecords', i, '[]');
                    try {
                        const records = JSON.parse(batchRecords);
                        options.body = { data: records };
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid JSON in Records', { itemIndex: i });
                    }
                }
                if (operation === 'upsert') {
                    const matchField = this.getNodeParameter('upsertMatchField', i);
                    let existingRecord = null;
                    const filter = {};
                    if (matchField === 'name' && resource === 'person') {
                        const firstName = this.getNodeParameter('firstName', i, '');
                        const lastName = this.getNodeParameter('lastName', i, '');
                        filter['name'] = {
                            firstName: { eq: firstName },
                            lastName: { eq: lastName },
                        };
                    }
                    else if (matchField === 'email' && resource === 'person') {
                        const matchValue = this.getNodeParameter('upsertMatchValue', i, '');
                        filter['emails'] = {
                            primaryEmail: { eq: matchValue },
                        };
                    }
                    else if (matchField === 'domainName' && resource === 'company') {
                        const matchValue = this.getNodeParameter('upsertMatchValue', i, '');
                        filter['domainName'] = {
                            primaryLinkUrl: { contains: matchValue },
                        };
                    }
                    else if (matchField === 'id') {
                        const matchValue = this.getNodeParameter('upsertMatchValue', i, '');
                        filter['id'] = { eq: matchValue };
                    }
                    else if (matchField === 'custom') {
                        const customField = this.getNodeParameter('customMatchField', i);
                        const matchValue = this.getNodeParameter('upsertMatchValue', i, '');
                        filter[customField] = { eq: matchValue };
                    }
                    const searchOptions = {
                        method: 'GET',
                        uri: `${baseUrl}/rest/${endpoint}`,
                        qs: {
                            first: 100,
                            filter: JSON.stringify(filter),
                        },
                        json: true,
                    };
                    let searchResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', searchOptions);
                    const resourceKey = Object.keys(searchResponse.data || {})[0];
                    let allRecords = ((_a = searchResponse.data) === null || _a === void 0 ? void 0 : _a[resourceKey]) || [];
                    while ((_b = searchResponse.pageInfo) === null || _b === void 0 ? void 0 : _b.hasNextPage) {
                        const nextOptions = {
                            ...searchOptions,
                            qs: {
                                ...searchOptions.qs,
                                after: searchResponse.pageInfo.endCursor,
                            },
                        };
                        searchResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', nextOptions);
                        if ((_c = searchResponse.data) === null || _c === void 0 ? void 0 : _c[resourceKey]) {
                            allRecords = allRecords.concat(searchResponse.data[resourceKey]);
                        }
                    }
                    existingRecord = allRecords.length > 0 ? allRecords[0] : null;
                    let body = {};
                    if (resource === 'person') {
                        body = buildPersonBody(i);
                    }
                    else if (resource === 'company') {
                        body = buildCompanyBody(i);
                    }
                    else if (resource === 'custom') {
                        const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}');
                        try {
                            Object.assign(body, JSON.parse(fieldsJson));
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
                        }
                    }
                    const additionalFields = this.getNodeParameter('additionalFields', i, '{}');
                    try {
                        const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
                        Object.assign(body, additional);
                    }
                    catch (error) {
                    }
                    if (existingRecord) {
                        options.method = 'PATCH';
                        options.uri = `${baseUrl}/rest/${endpoint}/${existingRecord.id}`;
                        options.body = body;
                    }
                    else {
                        options.method = 'POST';
                        options.body = body;
                    }
                }
                if (operation === 'get') {
                    const id = this.getNodeParameter('id', i);
                    options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
                }
                if (operation === 'getAll') {
                    const returnAll = this.getNodeParameter('returnAll', i, false);
                    const limit = this.getNodeParameter('limit', i, 50);
                    const additionalOptions = this.getNodeParameter('additionalOptions', i, {});
                    const qs = {};
                    if (!returnAll) {
                        qs.first = limit;
                    }
                    else {
                        qs.first = 100;
                    }
                    if (additionalOptions.orderBy) {
                        qs.orderBy = additionalOptions.orderBy;
                        qs.orderDirection = additionalOptions.orderDirection || 'ASC';
                    }
                    if (additionalOptions.filter) {
                        try {
                            const filter = typeof additionalOptions.filter === 'string'
                                ? JSON.parse(additionalOptions.filter)
                                : additionalOptions.filter;
                            qs.filter = JSON.stringify(filter);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid filter JSON', { itemIndex: i });
                        }
                    }
                    options.qs = qs;
                }
                if (operation === 'update') {
                    options.method = 'PATCH';
                    const id = this.getNodeParameter('id', i);
                    options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
                    let updateBody = {};
                    if (resource === 'person') {
                        updateBody = buildPersonBody(i);
                    }
                    else if (resource === 'company') {
                        updateBody = buildCompanyBody(i);
                    }
                    else if (resource === 'custom') {
                        const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}');
                        try {
                            Object.assign(updateBody, JSON.parse(fieldsJson));
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
                        }
                    }
                    const additionalFields = this.getNodeParameter('additionalFields', i, '{}');
                    try {
                        const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
                        Object.assign(updateBody, additional);
                    }
                    catch (error) {
                    }
                    options.body = updateBody;
                }
                if (operation === 'delete') {
                    options.method = 'DELETE';
                    const id = this.getNodeParameter('id', i);
                    options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
                }
                responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', options);
                if (operation === 'getAll' && responseData.data) {
                    const resourceKey = Object.keys(responseData.data)[0];
                    if (responseData.data[resourceKey]) {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll && ((_d = responseData.pageInfo) === null || _d === void 0 ? void 0 : _d.hasNextPage)) {
                            let allData = responseData.data[resourceKey];
                            let nextCursor = responseData.pageInfo.endCursor;
                            let pageCount = 1;
                            const maxPages = 100;
                            while (nextCursor && pageCount < maxPages) {
                                const nextOptions = {
                                    ...options,
                                    qs: { ...options.qs, after: nextCursor }
                                };
                                const nextResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'twentyCrmApi', nextOptions);
                                if (nextResponse.data && nextResponse.data[resourceKey]) {
                                    allData = allData.concat(nextResponse.data[resourceKey]);
                                    nextCursor = ((_e = nextResponse.pageInfo) === null || _e === void 0 ? void 0 : _e.hasNextPage) ? nextResponse.pageInfo.endCursor : null;
                                    pageCount++;
                                }
                                else {
                                    break;
                                }
                            }
                            responseData = allData;
                        }
                        else {
                            responseData = responseData.data[resourceKey];
                        }
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            resource,
                            operation,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                    itemIndex: i,
                });
            }
        }
        return [returnData];
    }
}
exports.TwentyCrm = TwentyCrm;
//# sourceMappingURL=TwentyCrm.node.js.map