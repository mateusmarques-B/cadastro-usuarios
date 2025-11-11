import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/lixeira.svg";
import Edit from "../../assets/edit.svg";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]); //lista de usuários
  const [userToEdit, setUserToEdit] = useState(null); // usuário em edição

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");

    setUsers(usersFromApi.data);
  }

  async function createUsers() {
    try {
      await api.post("/usuarios", {
        name: inputName.current.value,
        age: Number(inputAge.current.value),
        email: inputEmail.current.value,
      });
      getUsers();
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error);
    }
  }

  function startEditing(user) {
    setUserToEdit(user);
    inputName.current.value = user.name;
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  }

  async function updateUser(id) {
    if (!userToEdit) return;

    try {
      await api.put(`/usuarios/${userToEdit.id}`, {
        name: inputName.current.value,
        age: Number(inputAge.current.value),
        email: inputEmail.current.value,
      });

      setUserToEdit(null); // Limpa o estado para voltar ao modo de criação
      getUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error("Erro ao atualizar o usuário", error);
    }
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex items-center flex-col pt-24 body-gradient min-h-screen w-screen">
      <form className="flex flex-col gap-7 p-7 rounded-lg bg-[#2e2d4e] w-sm max-w-1/2 mb-5">
        <h1 className="text-white text-3xl text-center">
          Cadastro de Usuários
        </h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input
          placeholder="@email.com"
          name="email"
          type="email"
          ref={inputEmail}
        />
        <button
          className="rounded-4xl bg-[rgb(122,119,255)]/[0.7] hover:bg-[#7a77ff] h-10 border-none font-bold cursor-pointer text-white text-sm hover:text-base"
          type="button"
          onClick={userToEdit ? updateUser : createUsers}
        >
          {userToEdit ? "Atualizar" : "Cadastrar"}
        </button>
      </form>

      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between bg-[#2e2d4e] m-2.5 p-2.5 w-md rounded-lg"
        >
          <div>
            <p className="text-white font-bold;">
              Nome: <span className="font-normal">{user.name} </span>
            </p>
            <p className="text-white font-bold;">
              Idade: <span className="font-normal"> {user.age}</span>
            </p>
            <p className="text-white font-bold;">
              Email: <span className="font-normal">{user.email}</span>
            </p>
          </div>
          <button
            className="bg-transparent border-none cursor-pointer hover:opacity-0.5"
            onClick={() => startEditing(user)}
          >
            <img src={Edit} />
          </button>
          <button
            className="bg-transparent border-none cursor-pointer hover:opacity-0.5"
            onClick={() => deleteUsers(user.id)}
          >
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
