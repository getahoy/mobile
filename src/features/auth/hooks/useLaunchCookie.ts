import { useEffect, useState } from "react";
import { authClient } from "../client/authClient";
import { type LaunchCookie, readLaunchCookie } from "../launchCookie";

export function useLaunchCookie(): LaunchCookie {
  const [cookie, setCookie] = useState<LaunchCookie>("pending");

  useEffect(() => {
    void readLaunchCookie(authClient.getCookie).then(setCookie);
  }, []);

  return cookie;
}
