// loading
import Loading from "../../components/Loading/Loading";
import { useLoading } from "../../context/LoadingContext";


  const { isLoading, label, setLabel, show, hideWithMin } = useLoading();

useEffect(() => {
  return () => {
    // garante que o overlay não fica ativo após navegar
    hideWithMin(0);
  };
}, [hideWithMin]);



const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { isLoading, label, setLabel, show, hideWithMin } = useLoading();

  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);
  // Importação dos set's do contexto
  const { setUser, setToken, setExpiresAt, setWelcome } = useStateContext();
  
  useEffect(() => {
    return () => {
      // garante que o overlay não fica ativo após navegar
      hideWithMin(0);
    };
  }, [hideWithMin]);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setMessage(null);


    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // liga o loader
    setLabel("Entrando...");
    show();

    // Post para o backend usando o axiosClient criado em "../../axiosClient.js"
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token.plainTextToken);
        setExpiresAt(data.expiresAt);
        setWelcome(true);
        // console.log(data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        } else {
          setMessage(response.data.message);
        }
      })
      .finally(() => {
        // mantém no mínimo 400ms para evitar “piscar”
        hideWithMin(400);
      });
  };
  

    <Loading active={isLoading} text={label} />;