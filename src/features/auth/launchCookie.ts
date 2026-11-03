export type LaunchCookie = "pending" | "present" | "absent" | "unreadable";

export async function readLaunchCookie(
  read: () => Promise<string>,
): Promise<Exclude<LaunchCookie, "pending">> {
  try {
    return (await read()) === "" ? "absent" : "present";
  } catch {
    return "unreadable";
  }
}
