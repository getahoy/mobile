export const homeCopy = {
  title: "Ahoy",
  account: "Account",
  loading: "Loading your Macs…",
  emptyTitle: "Pair your Mac",
  emptyBody:
    "On your Mac, click the Ahoy icon in the menubar and choose Open Ahoy. Then scan the code it shows.",
  scan: "Scan code",
  addAnother: "Add another Mac",
  devStamp: (commit: string, loadedAt: string) =>
    `Dev build ${commit}, loaded ${loadedAt}`,
};
