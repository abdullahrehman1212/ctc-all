const GenerateUniqueKey = () => {
	// Generate a unique key using a combination of timestamp and a random number
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
const GenerateUniqueKey2 = () => {
	// Generate a unique key using a combination of timestamp and a random number
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
export { GenerateUniqueKey, GenerateUniqueKey2 };
