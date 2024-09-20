import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '../declarations/NFID_new_backend';

function App() {
  const [greeting, setGreeting] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();
      setLoggedIn(isAuthenticated);
    };

    checkAuthentication();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    NFID_new_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  const createNFID = async () => {
    const authClient = await AuthClient.create();
    const APP_NAME = "NFID Test";
    const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
    const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

    const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

    new Promise((resolve) => {
      authClient.login({
        identityProvider,
        onSuccess: () => {
          resolve(authClient);
          setLoggedIn(true);
        },
        windowOpenerFeatures: `
          left=${window.screen.width / 2 - 525 / 2},
          top=${window.screen.height / 2 - 705 / 2},
          toolbar=0,location=0,menubar=0,width=525,height=705
        `,
      });
    });

    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    const actor = createActor("bw4dl-smaaa-aaaaa-qaacq-cai", { agent });
    console.log("actor is", actor);
    const principalId = authClient.getIdentity().getPrincipal().toText();
    console.log("PrincipalId is", principalId);
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setLoggedIn(false);
  };

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      {loggedIn ? (
        <div>
          <p>Logged in</p>
          <button onClick={logout}>Logout</button>
          {/* Other authenticated user content can go here */}
        </div>
      ) : (
        <button onClick={createNFID}>Login</button>
      )}
    </main>
  );
}

export default App;
