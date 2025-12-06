import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IDataObject,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class TwentyCrm implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'twentyCrmApi',
				required: true,
			},
		],
		properties: [
			// Resource
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
			// Operations for standard resources
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
			// Operations for Metadata resource
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

			// ----------------------------------------
			//             Metadata Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Upsert Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Common Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Person Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Company Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Task Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Opportunity Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Custom Resource Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Batch Operations Fields
			// ----------------------------------------
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

			// ----------------------------------------
			//             Pagination
			// ----------------------------------------
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

			// ----------------------------------------
			//             Additional Fields (for create/update/upsert)
			// ----------------------------------------
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('twentyCrmApi');
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Map resource names to API endpoints
		const resourceMap: IDataObject = {
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

		// Handle Metadata operations
		if (resource === 'metadata') {
			try {
				let responseData;
				const baseUrl = credentials.apiUrl as string;

				if (operation === 'getObjects') {
					const options = {
						method: 'GET' as IHttpRequestMethods,
						uri: `${baseUrl}/rest/metadata/objects`,
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options as any,
					);
				}

				if (operation === 'getObjectSchema') {
					const objectName = this.getNodeParameter('objectName', 0) as string;
					const options = {
						method: 'GET' as IHttpRequestMethods,
						uri: `${baseUrl}/rest/metadata/objects/${objectName}`,
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options as any,
					);
				}

				if (operation === 'getFieldMetadata') {
					const objectName = this.getNodeParameter('objectName', 0) as string;
					const options = {
						method: 'GET' as IHttpRequestMethods,
						uri: `${baseUrl}/rest/metadata/objects/${objectName}/fields`,
						json: true,
					};
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'twentyCrmApi',
						options as any,
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: 0 } },
				);
				returnData.push(...executionData);
				return [returnData];
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message, resource, operation },
						pairedItem: { item: 0 },
					});
					return [returnData];
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: 0 });
			}
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let endpoint = resourceMap[resource] as string;
				
				// Handle custom resources
				if (resource === 'custom') {
					endpoint = this.getNodeParameter('customResource', i) as string;
				}

				const baseUrl = credentials.apiUrl as string;
				const options: IDataObject = {
					method: 'GET' as IHttpRequestMethods,
					uri: `${baseUrl}/rest/${endpoint}`,
					json: true,
				};

				// Helper function to build body for person resource
				const buildPersonBody = (index: number): IDataObject => {
					const body: IDataObject = {};
					const firstName = this.getNodeParameter('firstName', index, '') as string;
					const lastName = this.getNodeParameter('lastName', index, '') as string;
					
					if (firstName || lastName) {
						body.name = {
							firstName: firstName || '',
							lastName: lastName || '',
						};
					}
					
					const email = this.getNodeParameter('email', index, '') as string;
					if (email) {
						body.emails = {
							primaryEmail: email,
							additionalEmails: [],
						};
					}

					const phone = this.getNodeParameter('phone', index, '') as string;
					if (phone) {
						body.phones = {
							primaryPhoneNumber: phone,
							primaryPhoneCountryCode: 'US',
							additionalPhones: [],
						};
					}

					const jobTitle = this.getNodeParameter('jobTitle', index, '') as string;
					if (jobTitle) body.jobTitle = jobTitle;

					const city = this.getNodeParameter('city', index, '') as string;
					if (city) body.city = city;

					const companyId = this.getNodeParameter('companyId', index, '') as string;
					if (companyId) body.companyId = companyId;

					const linkedinUrl = this.getNodeParameter('linkedinUrl', index, '') as string;
					if (linkedinUrl) {
						body.linkedinLink = {
							primaryLinkLabel: 'LinkedIn',
							primaryLinkUrl: linkedinUrl,
						};
					}

					const xUrl = this.getNodeParameter('xUrl', index, '') as string;
					if (xUrl) {
						body.xLink = {
							primaryLinkLabel: 'X',
							primaryLinkUrl: xUrl,
						};
					}

					return body;
				};

				// Helper function to build body for company resource
				const buildCompanyBody = (index: number): IDataObject => {
					const body: IDataObject = {};
					
					body.name = this.getNodeParameter('name', index) as string;
					
					const domainName = this.getNodeParameter('domainName', index, '') as string;
					if (domainName) {
						body.domainName = {
							primaryLinkLabel: domainName,
							primaryLinkUrl: `https://${domainName}`,
						};
					}

					const employees = this.getNodeParameter('employees', index, 0) as number;
					if (employees > 0) body.employees = employees;

					const address = this.getNodeParameter('address', index, '') as string;
					if (address) {
						body.address = {
							addressStreet1: address,
							addressCity: '',
							addressCountry: '',
						};
					}

					const linkedinUrl = this.getNodeParameter('companyLinkedinUrl', index, '') as string;
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
					let body: IDataObject = {};

					if (resource === 'person') {
						body = buildPersonBody(i);
					}

					if (resource === 'company') {
						body = buildCompanyBody(i);
					}

					if (resource === 'task') {
						body.title = this.getNodeParameter('title', i) as string;
						const bodyText = this.getNodeParameter('body', i, '') as string;
						if (bodyText) {
							body.bodyV2 = { markdown: bodyText };
						}
						body.status = this.getNodeParameter('status', i, 'TODO') as string;
						const dueAt = this.getNodeParameter('dueAt', i, '') as string;
						if (dueAt) body.dueAt = dueAt;
					}

					if (resource === 'note') {
						body.title = this.getNodeParameter('title', i) as string;
						const bodyText = this.getNodeParameter('body', i, '') as string;
						if (bodyText) {
							body.bodyV2 = { markdown: bodyText };
						}
					}

					if (resource === 'opportunity') {
						body.name = this.getNodeParameter('opportunityName', i) as string;
						body.amount = this.getNodeParameter('amount', i, 0) as number;
						body.stage = this.getNodeParameter('stage', i, 'NEW') as string;
						body.probability = this.getNodeParameter('probability', i, 0) as number;
						const closeDate = this.getNodeParameter('closeDate', i, '') as string;
						if (closeDate) body.closeDate = closeDate;
					}

					if (resource === 'custom') {
						const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}') as string;
						try {
							Object.assign(body, JSON.parse(fieldsJson));
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
						}
					}

					// Merge additional fields
					const additionalFields = this.getNodeParameter('additionalFields', i, '{}') as string;
					try {
						const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
						Object.assign(body, additional);
					} catch (error) {
						// Ignore parse errors for additional fields
					}

					options.body = body;
				}

				if (operation === 'createMany') {
					options.method = 'POST';
					options.uri = `${baseUrl}/rest/${endpoint}/batch`;
					
					const batchRecords = this.getNodeParameter('batchRecords', i, '[]') as string;
					try {
						const records = JSON.parse(batchRecords);
						options.body = { data: records };
					} catch (error) {
						throw new NodeOperationError(this.getNode(), 'Invalid JSON in Records', { itemIndex: i });
					}
				}

				if (operation === 'upsert') {
					// First, search for existing record
					const matchField = this.getNodeParameter('upsertMatchField', i) as string;
					let existingRecord = null;

					// Build search filter based on match field
					const filter: IDataObject = {};
					
					if (matchField === 'name' && resource === 'person') {
						const firstName = this.getNodeParameter('firstName', i, '') as string;
						const lastName = this.getNodeParameter('lastName', i, '') as string;
						filter['name'] = {
							firstName: { eq: firstName },
							lastName: { eq: lastName },
						};
					} else if (matchField === 'email' && resource === 'person') {
						const matchValue = this.getNodeParameter('upsertMatchValue', i, '') as string;
						filter['emails'] = {
							primaryEmail: { eq: matchValue },
						};
					} else if (matchField === 'domainName' && resource === 'company') {
						const matchValue = this.getNodeParameter('upsertMatchValue', i, '') as string;
						filter['domainName'] = {
							primaryLinkUrl: { contains: matchValue },
						};
					} else if (matchField === 'id') {
						const matchValue = this.getNodeParameter('upsertMatchValue', i, '') as string;
						filter['id'] = { eq: matchValue };
					} else if (matchField === 'custom') {
						const customField = this.getNodeParameter('customMatchField', i) as string;
						const matchValue = this.getNodeParameter('upsertMatchValue', i, '') as string;
						filter[customField] = { eq: matchValue };
					}

					// Search with full pagination to find existing record
					const searchOptions = {
						method: 'GET' as IHttpRequestMethods,
						uri: `${baseUrl}/rest/${endpoint}`,
						qs: {
							first: 100,
							filter: JSON.stringify(filter),
						},
						json: true,
					};

					let searchResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'twentyCrmApi',
						searchOptions as any,
					);

					// Check if we found a match
					const resourceKey = Object.keys(searchResponse.data || {})[0];
					let allRecords = searchResponse.data?.[resourceKey] || [];

					// Paginate through all results if needed
					while (searchResponse.pageInfo?.hasNextPage) {
						const nextOptions = {
							...searchOptions,
							qs: {
								...searchOptions.qs,
								after: searchResponse.pageInfo.endCursor,
							},
						};
						searchResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'twentyCrmApi',
							nextOptions as any,
						);
						if (searchResponse.data?.[resourceKey]) {
							allRecords = allRecords.concat(searchResponse.data[resourceKey]);
						}
					}

					existingRecord = allRecords.length > 0 ? allRecords[0] : null;

					// Build the body
					let body: IDataObject = {};
					if (resource === 'person') {
						body = buildPersonBody(i);
					} else if (resource === 'company') {
						body = buildCompanyBody(i);
					} else if (resource === 'custom') {
						const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}') as string;
						try {
							Object.assign(body, JSON.parse(fieldsJson));
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
						}
					}

					// Merge additional fields
					const additionalFields = this.getNodeParameter('additionalFields', i, '{}') as string;
					try {
						const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
						Object.assign(body, additional);
					} catch (error) {
						// Ignore parse errors
					}

					if (existingRecord) {
						// Update existing record
						options.method = 'PATCH';
						options.uri = `${baseUrl}/rest/${endpoint}/${existingRecord.id}`;
						options.body = body;
					} else {
						// Create new record
						options.method = 'POST';
						options.body = body;
					}
				}

				if (operation === 'get') {
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
				}

				if (operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
					
					const qs: IDataObject = {};
					
					if (!returnAll) {
						qs.first = limit;
					} else {
						qs.first = 100; // Fetch in batches of 100 for full pagination
					}
					
					if (additionalOptions.orderBy) {
						qs.orderBy = additionalOptions.orderBy;
						qs.orderDirection = additionalOptions.orderDirection || 'ASC';
					}
					
					if (additionalOptions.filter) {
						try {
							const filter = typeof additionalOptions.filter === 'string' 
								? JSON.parse(additionalOptions.filter as string) 
								: additionalOptions.filter;
							qs.filter = JSON.stringify(filter);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid filter JSON', { itemIndex: i });
						}
					}
					
					options.qs = qs;
				}

				if (operation === 'update') {
					options.method = 'PATCH';
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
					
					let updateBody: IDataObject = {};
					
					if (resource === 'person') {
						updateBody = buildPersonBody(i);
					} else if (resource === 'company') {
						updateBody = buildCompanyBody(i);
					} else if (resource === 'custom') {
						const fieldsJson = this.getNodeParameter('fieldsJson', i, '{}') as string;
						try {
							Object.assign(updateBody, JSON.parse(fieldsJson));
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in Fields', { itemIndex: i });
						}
					}

					// Merge additional fields
					const additionalFields = this.getNodeParameter('additionalFields', i, '{}') as string;
					try {
						const additional = typeof additionalFields === 'string' ? JSON.parse(additionalFields) : additionalFields;
						Object.assign(updateBody, additional);
					} catch (error) {
						// Ignore parse errors
					}
					
					options.body = updateBody;
				}

				if (operation === 'delete') {
					options.method = 'DELETE';
					const id = this.getNodeParameter('id', i) as string;
					options.uri = `${baseUrl}/rest/${endpoint}/${id}`;
				}

				responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'twentyCrmApi',
					options as any,
				);

				// Handle response for getAll with full pagination
				if (operation === 'getAll' && responseData.data) {
					const resourceKey = Object.keys(responseData.data)[0];
					if (responseData.data[resourceKey]) {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll && responseData.pageInfo?.hasNextPage) {
							let allData = responseData.data[resourceKey];
							let nextCursor = responseData.pageInfo.endCursor;
							let pageCount = 1;
							const maxPages = 100; // Safety limit
							
							while (nextCursor && pageCount < maxPages) {
								const nextOptions = { 
									...options, 
									qs: { ...(options.qs as IDataObject), after: nextCursor } 
								};
								
								const nextResponse = await this.helpers.httpRequestWithAuthentication.call(
									this,
									'twentyCrmApi',
									nextOptions as any,
								);
								
								if (nextResponse.data && nextResponse.data[resourceKey]) {
									allData = allData.concat(nextResponse.data[resourceKey]);
									nextCursor = nextResponse.pageInfo?.hasNextPage ? nextResponse.pageInfo.endCursor : null;
									pageCount++;
								} else {
									break;
								}
							}
							
							responseData = allData;
						} else {
							responseData = responseData.data[resourceKey];
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: any) {
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
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
