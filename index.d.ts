declare module "masternode" {
	function request(url: string, requestData?: {}, authorization?: any): Promise<any>;

	/**
	 * action, user_uid, user_type, db_date
	 */
	function nextRequest(req: any, res: any, methods: any, jwtkey: string): Promise<any>;
	function userPermissions(api: string, token?: string, data?: {}): Promise<any>;
	function randomNumber(length: number): number;
	/**
	 * @param smtp [ host, port, user, pass ]
	 * @param from [ name, email ]
	 * @param to [ name, email ]
	 * @param info [ subject, message ]
	 * @param reply [ name, email ] - OPTIONAL
	 */
	function mail(
		smtp: (string | number)[],
		from: string[],
		to: string[],
		info: string[],
		reply?: string[]
	): Promise<{
		status: number;
		message: string;
	}>;

	function checkSMTP({ host, port, user, pass, secure }: { host?: string; port?: number; user?: string; pass?: string; secure?: boolean }): Promise<any>;

	function fileExtension(filename: string): string;
	function localDateTime(dateTime: any, dtFormat?: string): string;
	/************************************************************************************************
	 * options = { width: 200, height: null, quality: 50, keepOriginal: 0, pretext: 'min' }
	 ************************************************************************************************/
	function fileUpload(apiUrl: string, directory: string, file: any, options?: {}): Promise<any>;
	function fileDelete(apiUrl: string, file: string): Promise<boolean>;
	function fileBytesConvert(bytes: number, unit?: string): number;

	function strShorten(text: string, length: number): string;
	function strShuffle(text: string): string;
	function strUrl(text: string): string;
	function strPhone(text: string): string;

	function mysqlQuery(
		query: string,
		{
			host,
			user,
			password,
			database,
			port,
		}: {
			host: string;
			user: string;
			password: string;
			database: string;
			port?: number;
		}
	): Promise<any>;
	function mysqlProcedure(
		procName: string,
		procAction: string,
		data?: {},
		{
			host,
			user,
			password,
			database,
			port,
		}: {
			host: string;
			user: string;
			password: string;
			database: string;
			port?: number;
		},
		debug?: boolean
	): Promise<any>;
	function mysqlTableData(
		reqData: {},
		procName: string,
		procAction: string,
		{
			host,
			user,
			password,
			database,
			port,
		}: {
			host: string;
			user: string;
			password: string;
			database: string;
			port?: number;
		}
	): Promise<{
		data: any;
		total: number;
	}>;

	function mysqlDate(): string;
	function mysqlSanitizeData(data: any): any;

	function encrypt(text: string, key: string): Promise<any>;
	function decrypt(text: string, key: string): Promise<any>;
}
