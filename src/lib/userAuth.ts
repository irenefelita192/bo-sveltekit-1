// import { getNewToken } from '@actions/auth'

export const getUserData = () => {
  let userDt = null;
  try {
    userDt = JSON.parse(localStorage.getItem("uac"));
  } catch (e) {
    // setUserData(userDt)
  }

  return userDt;
};

export const isRenewToken = (expiryAt) => {
  const currentTime = new Date().getTime();

  // console.log('expiryAt', expiryAt * 1000)
  // console.log('isexpired', currentTime >= expiryAt * 1000)

  return currentTime >= expiryAt * 1000;
};

// export const renewToken = async (token, refreshToken, expiryAt) => {
//     const currentTime = new Date().getTime()
//     const userDt = getUserData()
//     let newSession = { accessToken: token, refreshToken, expiryAt }

//     // console.log('refreshToken', refreshToken)
//     // console.log('currentTime', currentTime)
//     // console.log('expiryAt', expiryAt * 1000)
//     // console.log('isexpired', currentTime >= expiryAt * 1000)
//     if (userDt && currentTime >= expiryAt * 1000) {
//         // console.log('sudah expired nih')
//         const result = await post(`/auth/renewToken`, { token, refreshToken })
//         // console.log('result renewtoken', result)
//         if (result && result.accessToken) {
//             newSession = { ...result }
//         }
//     }

//     return newSession
// }

export const doRenewToken = async (fetch, token, refreshToken, expiryAt) => {
  // const currentTime = new Date().getTime()
  // console.log('doRenewToken token', token)
  // console.log('doRenewToken refreshToken', refreshToken)
  let newSession = null;
  if (isRenewToken(expiryAt)) {
    try {
      const resultRes = await fetch(`/auth/renewToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          refreshToken,
        }),
      });
      // console.log('resultRes', resultRes)
      if (resultRes && resultRes.status == 200) {
        const result = await resultRes.json();

        if (result && result.accessToken) {
          newSession = { ...result };
        } else {
          console.error("Error result doRenewToken:", result);
          newSession = {
            error: "accessToken not found",
          };
        }
      } else {
        const result = await resultRes.text();
        newSession = {
          error: `${resultRes.status} - ${result}`,
        };
      }
    } catch (err) {
      console.error("Error doRenewToken:", err);
    }
  }
  return newSession;
  // }
};

export const getPermission = ({
  moduleAccesses,
  moduleId = 0,
  moduleLevels,
}) => {
  let permission: any;
  moduleLevels &&
    moduleLevels.map((moduleLevel) => {
      const result =
        moduleAccesses &&
        moduleAccesses.find((mod) => {
          return (
            mod.moduleId === moduleId && mod.moduleLevel === moduleLevel.level
          );
        });

      permission = {
        ...permission,
        [moduleLevel.levelName]: result ? true : false,
      };
    });

  return permission;
};
