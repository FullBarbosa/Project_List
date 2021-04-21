import { FormEvent, useContext, useEffect, useState } from "react";
import { CardContext } from "../../hooks/CardContext";

import { MdCancel } from "react-icons/md";

import { Container, ContentGrupViabilidade, ListViabilidade } from "./styles";

import Modal from "react-modal";
Modal.setAppElement("#root");

export default function ModalEditCard() {
    const {
        isOpenModalEditCard,
        hadleOpenModalEditCard,
        dadoStorage,
        editCardProject,
    } = useContext(CardContext);

    const [inputDescricao, setInputDescricao] = useState("");
    const [inputValidade, setInputValidade] = useState(1);

    useEffect(() => {
        setInputValidade(dadoStorage.viabilidade);
    }, [dadoStorage]);

    function hadleEditProject() {
        const dado = {
            id: dadoStorage.id,
            responsavel: dadoStorage.responsavel,
            titulo: dadoStorage.titulo,
            descricao:
                inputDescricao === "" ? dadoStorage.descricao : inputDescricao,
            viabilidade: inputValidade,
            status: dadoStorage.status,
            valorDeExecucao: dadoStorage.valorDeExecucao,
            dataInicio: dadoStorage.dataInicio,
            dataFinal: dadoStorage.dataFinal,
            iniciado: dadoStorage.iniciado,
            finalizado: dadoStorage.finalizado,
        };

        editCardProject(dado);
    }

    return (
        <Modal
            isOpen={isOpenModalEditCard}
            onRequestClose={hadleOpenModalEditCard}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <Container>
                <h2>Editar Projeto: {dadoStorage.titulo}</h2>

                <button
                    className="react-modal-close"
                    onClick={(event: FormEvent) => {
                        event.preventDefault();
                        hadleOpenModalEditCard();
                    }}
                >
                    <MdCancel />
                </button>

                <label htmlFor="">
                    <textarea
                        placeholder={
                            dadoStorage.descricao === ""
                                ? "Descrição do projeto"
                                : dadoStorage.descricao
                        }
                        onChange={(event) => {
                            setInputDescricao(event.target.value);
                        }}
                    />
                </label>

                <ContentGrupViabilidade>
                    <span>Viabilidade:</span>
                    <ul>
                        <ListViabilidade
                            onClick={() => setInputValidade(1)}
                            inputValidade={inputValidade}
                            viabilidade={1}
                        >
                            1
                        </ListViabilidade>
                        <ListViabilidade
                            onClick={() => setInputValidade(2)}
                            inputValidade={inputValidade}
                            viabilidade={2}
                        >
                            2
                        </ListViabilidade>
                        <ListViabilidade
                            onClick={() => setInputValidade(3)}
                            inputValidade={inputValidade}
                            viabilidade={3}
                        >
                            3
                        </ListViabilidade>
                        <ListViabilidade
                            onClick={() => setInputValidade(4)}
                            inputValidade={inputValidade}
                            viabilidade={4}
                        >
                            4
                        </ListViabilidade>
                        <ListViabilidade
                            onClick={() => setInputValidade(5)}
                            inputValidade={inputValidade}
                            viabilidade={5}
                        >
                            5
                        </ListViabilidade>
                    </ul>
                </ContentGrupViabilidade>

                <button
                    type="submit"
                    onClick={(event) => {
                        event.preventDefault();
                        hadleEditProject();
                    }}
                >
                    Confirmar
                </button>
            </Container>
        </Modal>
    );
}