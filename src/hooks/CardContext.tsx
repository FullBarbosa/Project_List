import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../service/api";

// interface para inglobar o contexto
interface CardProviderProps {
    children: ReactNode;
}

// interfaxe da requisição da api
interface ListProject {
    id: string;
    responsavel: string;
    titulo: string;
    descricao: string;
    viabilidade: number;
    status: string;
    valorDeExecucao: number;
    dataInicio: string;
    dataFinal: string;
    iniciado: string;
    finalizado: string;
}

// interface do contexto
interface CardProps {
    list: ListProject[];
    dadoStorage: ListProject;

    isOpenModalCreateCard: boolean;
    isOpenModalEditCard: boolean;

    filterStatus: string;

    hadleOpenModalCreateCard: () => void;
    hadleOpenModalEditCard: () => void;
    createCardProject: (date: ListProject) => void;
    editCardProject: (date: ListProject) => void;
    editCard: (id: string) => void;
    cancelCard: (id: string) => void;
    concluidoCard: (id: string) => void;
    desenvolvimentoCard: (id: string) => void;
    hadleFilterStatus: (filterStatus: string) => void;
}

export const CardContext = createContext<CardProps>({} as CardProps);

export function CardProvider({ children }: CardProviderProps) {
    // estado de armazenamento de Lista de projetos da api
    const [list, setList] = useState<ListProject[]>([]);

    const [filterStatus, setFilterStatus] = useState("");

    // Valor por Id
    const [dadoStorage, setDadoStorage] = useState<ListProject>(() => {
        const storagedCard = localStorage.getItem("project");
        if (storagedCard) {
            return JSON.parse(storagedCard);
        }
        return [];
    });

    // estados para modal
    const [isOpenModalCreateCard, setIsOpenModalCreateCard] = useState(false);
    const [isOpenModalEditCard, setIsOpenModalEditCard] = useState(false);

    // Metodo get da api, buscando dados do backend
    useEffect(() => {
        api.get("list")
            .then((response) => setList(response.data))
            .catch(() => {
                toast.error("Error ao carregar dados");
            });
    }, []);

    // Criar um novo projeto
    async function createCardProject(data: ListProject) {
        try {
            const response = await api.post("list", data);

            const listDate = response.data;

            setList([...list, listDate]);
            toast.success("Projeto cadastrado!");
            hadleOpenModalCreateCard();
            if (response.status !== 200) throw new Error(response.headers);
        } catch (error) {
            toast.error("Error ao criar projeto, servidor off");
            setIsOpenModalCreateCard(false);
            return;
        }
    }

    // editar  projeto
    async function editCardProject(data: ListProject) {
        try {
            const response = await api.put(`list/${data.id}`, {
                ...data,
                descricao: data.descricao,
                viabilidade: data.viabilidade,
            });

            const newData = list.filter((data) => data.id !== response.data.id);
            const date = response.data;

            setList([date, ...newData]);
            toast.warning("Projeto editado!");
            hadleOpenModalEditCard();
            if (response.status !== 200) throw new Error(response.headers);
        } catch (error) {
            toast.error("Error ao editar projeto, servidor off");
            return false;
        }
    }

    // mudança de estado para cancelado
    async function cancelCard(id: string) {
        const response = list.filter((dado) => dado.id.includes(id));
        const dado = response[0];

        const data = new Date();
        const editResponse = await api.put(`list/${dado.id}`, {
            ...dado,
            finalizado: data.toLocaleDateString("pt-BR"),
            status: "cancelado",
        });

        const newData = list.filter((data) => data.id !== editResponse.data.id);
        const date = editResponse.data;

        setList([date, ...newData]);
        toast.error("Projeto cancelado!");
    }

    // mudança de estado para conlcuido
    async function concluidoCard(id: string) {
        const response = list.filter((dado) => dado.id.includes(id));
        const dado = response[0];

        const data = new Date();

        const editResponse = await api.put(`list/${dado.id}`, {
            ...dado,
            finalizado: data.toLocaleDateString("pt-BR"),
            status: "concluido",
        });

        const newData = list.filter((data) => data.id !== editResponse.data.id);
        const date = editResponse.data;

        setList([date, ...newData]);
        toast.success("Projeto concluido!");
    }

    // mudança do estado para  desenvolvimento
    async function desenvolvimentoCard(id: string) {
        const response = list.filter((dado) => dado.id.includes(id));
        const dado = response[0];

        const data = new Date();

        const editResponse = await api.put(`list/${dado.id}`, {
            ...dado,
            iniciado: data.toLocaleDateString("pt-BR"),
            status: "desenvolvimento",
        });

        const newData = list.filter((data) => data.id !== editResponse.data.id);
        const date = editResponse.data;

        setList([date, ...newData]);
        toast.info("Projeto em desenvolvimento!");
    }

    // passando valor do prejto id, e injetando no localStorag
    function editCard(id: string) {
        localStorage.setItem(
            "project",
            JSON.stringify(list.filter((dado) => dado.id.includes(id)))
        );

        const dado = list.filter((dado) => dado.id.includes(id));
        setDadoStorage(dado[0]);
        hadleOpenModalEditCard();
    }

    function hadleFilterStatus(filter: string) {
        setFilterStatus(filter);
    }

    // logica para abrir modal de criação
    function hadleOpenModalCreateCard() {
        setIsOpenModalCreateCard(!isOpenModalCreateCard);
    }

    // logica para abrir modal de edição
    function hadleOpenModalEditCard() {
        setIsOpenModalEditCard(!isOpenModalEditCard);
    }

    // valores de contexto
    return (
        <CardContext.Provider
            value={{
                list,
                dadoStorage,
                hadleOpenModalCreateCard,
                isOpenModalCreateCard,
                createCardProject,
                isOpenModalEditCard,
                hadleOpenModalEditCard,
                editCard,
                editCardProject,
                cancelCard,
                concluidoCard,
                desenvolvimentoCard,
                hadleFilterStatus,
                filterStatus,
            }}
        >
            {children}
        </CardContext.Provider>
    );
}
