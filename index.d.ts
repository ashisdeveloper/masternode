// declare module "masternode" {
// 	function request(url: string, requestData?: {}, authorization?: any): Promise<any>;
// 	function generateRandomNumber(length: number): number;

// 	function fileExtension(filename: string): string;
// 	/************************************************************************************************
// 	 * options = { width: 200, height: null, quality: 50, keepOriginal: 0, pretext: 'min' }
// 	 ************************************************************************************************/
// 	function fileUpload(apiUrl: string, directory: string, file: any, options?: {}): Promise<any>;
// 	function fileDelete(apiUrl: string, file: string): Promise<boolean>;
// 	function fileBytesConvert(bytes: number, unit?: string): number;

// 	function strShorten(text: string, length: number): string;
// 	function strShuffle(text: string): string;
// 	function strUrl(text: string): string;
// 	function strPhone(text: string): string;

// 	function mysqlQuery(
// 		query: string,
// 		{
// 			host,
// 			user,
// 			password,
// 			database,
// 			port,
// 		}: {
// 			host: string;
// 			user: string;
// 			password: string;
// 			database: string;
// 			port?: number;
// 		}
// 	): Promise<any>;
// 	function mysqlProcedure(procName: string, procAction: string, data?: {}, debug?: boolean): Promise<any>;
// 	function mysqlDate(): string;

// 	function encrypt(text: string, key: string): Promise<any>;
// 	function decrypt(text: string, key: string): Promise<any>;
// }

declare function request(url: string, requestData?: {}, authorization?: any): Promise<any>;
declare function generateRandomNumber(length: number): number;

declare function fileExtension(filename: string): string;
/************************************************************************************************
 * options = { width: 200, height: null, quality: 50, keepOriginal: 0, pretext: 'min' }
 ************************************************************************************************/
declare function fileUpload(apiUrl: string, directory: string, file: any, options?: {}): Promise<any>;
declare function fileDelete(apiUrl: string, file: string): Promise<boolean>;
declare function fileBytesConvert(bytes: number, unit?: string): number;

declare function strShorten(text: string, length: number): string;
declare function strShuffle(text: string): string;
declare function strUrl(text: string): string;
declare function strPhone(text: string): string;

declare function mysqlQuery(
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
declare function mysqlProcedure(procName: string, procAction: string, data?: {}, debug?: boolean): Promise<any>;
declare function mysqlDate(): string;

declare function encrypt(text: string, key: string): Promise<any>;
declare function decrypt(text: string, key: string): Promise<any>;

export = strShorten;