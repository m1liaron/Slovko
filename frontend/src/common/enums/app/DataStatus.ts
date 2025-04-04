const DataStatus = {
	IDLE: "idle",
	PENDING: "pending",
	SUCCESS: "success",
	ERROR: "error",
} as const;

type IDataStatus = typeof DataStatus[keyof typeof DataStatus];

export { DataStatus };
export type { IDataStatus }