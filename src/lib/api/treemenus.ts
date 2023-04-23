import { sessionValue } from "$stores/auth";
import { doRenewToken } from "$lib/userAuth";
import { treemenus, menuList } from "$stores/treemenus";
let payload = {
  meta: {
    status: "loading",
    error: "",
  },
  data: [],
};

export async function getTreemenus({ session, baseEndpoint }) {
  const { accessToken, refreshToken, expiryAt } = session;
  // console.log('sessions', session)
  let newSession = { accessToken, refreshToken, expiryAt };
  const renewResult = await doRenewToken(
    fetch,
    accessToken,
    refreshToken,
    expiryAt
  );
  if (renewResult && renewResult.accessToken) {
    newSession = renewResult;
    sessionValue.set({ ...newSession });
  }

  // console.log('newSession', newSession)
  sessionValue.set({ ...newSession });

  // const at = userResponse.accessToken
  // console.log('newAccessObj', newAccessObj)
  try {
    const response = await fetch(`${baseEndpoint}/treemenus`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newSession.accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      payload.meta.status = "success";
      menuList.set(data);
      const nest = (items, id = null, link = "parentId") =>
        items
          .filter((item) => item[link] === id)
          .map((item) => ({
            ...item,
            children: nest(items, item.id),
          }));
      const tree = nest(data);

      payload.data = [...tree];

      treemenus.set(payload);
    }
  } catch (err) {
    payload.meta.status = "error";
    payload.meta.error = "Error treemenu: " + err;
    payload.data = [];
    treemenus.set(payload);
  }
}
