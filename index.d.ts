declare module "masternode" {
	function request(url: string, requestData?: {}, authorization?: any): Promise<any>;
	function generateRandomNumber(length: number): number;

	function fileExtension(filename: string): string;
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
	function mysqlProcedure(procName: string, procAction: string, data?: {}, debug?: boolean): Promise<any>;
	function mysqlDate(): string;

	function encrypt(text: string, key: string): Promise<any>;
	function decrypt(text: string, key: string): Promise<any>;
}