import { useContext } from "react";
import { Container } from "react-bootstrap";
import Balance from "./components/Balance";
import NavBar from "./components/NavBar";
import Staked from "./components/Staked";
import Unstaked from "./components/Unstaked";
import { WalletContext } from "./Wallet";


function App() {
  const { wallet } = useContext(WalletContext)
  return (
    <div className="App">
      <NavBar />
      {
        wallet && wallet.isSignedIn() ? 
        <>
          <Balance />
          <Container fluid className="main">
            <Unstaked />
            <hr />
            <Staked />
          </Container>
        </> : <></>
      }
    </div>
  );
}

export default App;
