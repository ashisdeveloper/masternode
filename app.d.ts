declare module "masternode" {
	function request(url: string, options: Object, authorization: string): any;
	function shortenText(text: string, length: number): any;
	function fileExtension(fileName: string): any;
	function shuffleStr(text: string): any;
	function formatPhoneNum(text: string): any;
	function strToUrl(text: string): any;
	function generateOtp(length: number): any;
}
