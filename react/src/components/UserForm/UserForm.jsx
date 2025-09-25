import axiosClient from "../../axios-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  if (id) {
    useEffect(() => {
      setLoading(true);

      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          // Caso queria acessar sem usar o ultimo ".data" é só adicionar essa linha: public static $wrap = false; no resouce(php)
          // Isso server para gerar uma resposta que não seja um json com esse campo data por fora
          setUser(data.data);
        })
        .catch((error) => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          // TODO show notification
          setNotification("User has successfully update");
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, user)
        .then(() => {
          // TODO show notification
          setNotification("User has successfully created");
          navigate("/users");
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };
  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User</h1>}

      <div className="card animated FadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={(ev) => setUser({ ...user, name: ev.target.value })}
              type="text"
              placeholder="Name"
            />
            <input
              value={user.email}
              onChange={(ev) => setUser({ ...user, email: ev.target.value })}
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(ev) => setUser({ ...user, password: ev.target.value })}
              type="password"
              placeholder="Password"
            />
            <input
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              type="password"
              placeholder="Password Confirmation"
            />

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserForm;
