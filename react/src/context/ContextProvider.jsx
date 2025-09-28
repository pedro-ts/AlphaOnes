import { createContext, use, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    notification: null,
    expiresAt: null,
    welcome: false,
    setWelcome: () => {},
    setExpiresAt: () => {},
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {}
})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState('');
    const [welcome, setWelcome] = useState(false);
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [expiresAt, _setExpiresAt] = useState(localStorage.getItem('EXPIRES_AT'));
    // const [token, _setToken] = useState(123);


    const setNotification = (message) =>{
        _setNotification(message);
        setTimeout(()=>{
            _setNotification('');
        }, 5000)
    }

    const setToken = (token) => {
        _setToken(token); //Armazena o token no state do token(o padrão criado acima)
        if (token){
            localStorage.setItem('ACCESS_TOKEN', token) //Armazenamos no local para que sempre que o usuario recarregar a pagina ele manter a informação que está com o token ainda
        } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
    }
    const setExpiresAt = (expiresAt) => {
        _setExpiresAt(expiresAt); //Armazena o token no state do token(o padrão criado acima)
        if (expiresAt){
            localStorage.setItem('EXPIRES_AT', expiresAt) //Armazenamos no local para que sempre que o usuario recarregar a pagina ele manter a informação que está com o token ainda
        } else {
            localStorage.removeItem('EXPIRES_AT')
        }
    }

return(
    <StateContext.Provider value={{
        user,
        token,
        expiresAt,
        setExpiresAt,
        setUser,
        setToken,
        notification,
        setNotification,
        welcome,
        setWelcome,
    }}>
        {children}
    </StateContext.Provider>
)
}

export const useStateContext = () => useContext(StateContext)
