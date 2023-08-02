export interface RiotResponse<Data> {
  data: Data | undefined;
  error: string | undefined;
}

export async function decodeRiotData<Data>(
  response: Response
): Promise<RiotResponse<Data>> {
  let data = await response.json();
  const statusCode = data.status?.status_code;
  if (statusCode && statusCode !== 200)
    return { data: undefined, error: data.status.message };
  return { data, error: undefined };
}
