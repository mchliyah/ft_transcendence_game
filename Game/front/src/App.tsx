import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import ErrorToast from "./components/ErrorToast";
import ProtectRoutes from "./components/ProtectRoutes";
import ConfirmEmail from "./pages/ConfirmEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailRedirection from "./pages/EmailRedirection";
import Email from "./components/Email";
import ResendEmail from "./pages/ResendEmail";
import ModalUi from "./components/ModalUi";
import SetPassword from "./pages/SetPassword";
import Signin42 from "./pages/Signin42";
import TFactorAuth from "./pages/TFactorAuth";
import GenerateQr from "./pages/GenerateQr";
import Logout from "./components/Logout";
import RequireNoAuth from "./components/RequireNoAuth";
import ProtectPassword from "./components/ProtectPassword";
import ProtectConfirmation from "./components/ProtectConfirmation";
import Dms from "./pages/Chat/Dms";
import Test from "./pages/Test";
import Testt from "./pages/Test";
import TabsTest from "./pages/Chat/Tabs";
// import { createTheme, ThemeProvider } from '@mui/material';
import Chat from "./pages/Chat/Chat";
import MessageUser from "./pages/Chat/MessageUser";
import RightSide from "./pages/Chat/RightSide";
import Game from "./pages/game/Game";
import NavigateToGame from "./pages/game/navigatetogame";

// const theme = createTheme();

function App() {
  return (
    // <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        {/**----------------Auth Pages ----------------------*/}
        <Route path="/" element={
          // <RequireNoAuth>
            <Landing/>
          // </RequireNoAuth>
        }>
          
        </Route>
          <Route path="login" element={
            // <RequireNoAuth>
                <Login />
            // </RequireNoAuth>
          }/>
          <Route path="register" element={
            // <RequireNoAuth>
              <Register />
            // </RequireNoAuth>
          }/>
        <Route path="home" element={
            // <ProtectRoutes>
              <Home/>
            //  </ProtectRoutes>
          }>
        </Route>
          <Route path="complete-profile" element={
            <ProtectRoutes>
              <CompleteProfile />
            </ProtectRoutes>
          } />
          <Route path="confirm-email" element={
            // <ProtectConfirmation>
              <ConfirmEmail />
          // </ProtectConfirmation>
          }/>
          <Route path="forgot-password" element={
            // <RequireNoAuth>
              <ForgotPassword />
            // </RequireNoAuth>}/>
          }/>
          <Route path="change-password" element={<ResetPassword />}/>
          <Route path="redirect-email" element={<EmailRedirection />}/>
          <Route path="resend-email" element={
            // <ProtectConfirmation>
          <ResendEmail />
          // </ProtectConfirmation>
          }/>
          <Route path="set-password" element=
          {
            <ProtectPassword>
          <SetPassword />
          </ProtectPassword>
        }
          />
          <Route path="signin42" element={<Signin42 />}/>
          <Route path="2fa" element={<TFactorAuth />}/>
          <Route path="generate-qr" element={<GenerateQr />}/>
          <Route path="logout" element={<Logout />}/>
          
          {/**----------------Chat Pages ----------------------*/}
          <Route path="chat">
            <Route path="dms" element={<Dms />}/>
            <Route path="rightSide" element={<RightSide />}/>
          </Route>
		  	{/*<Route path="NavigateToGame" element={<NavigateToGame />} />*/}
		  	<Route path="game" element={<Game />} />{/* trying to use email as root paramtr*/}
  			<Route path="testt" element={<Testt />} />
      </Routes>
    </BrowserRouter>
    // </ThemeProvider>
  );
}

export default App;
