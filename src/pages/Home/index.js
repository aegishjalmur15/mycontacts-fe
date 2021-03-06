import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import {
  Container, Header, ListHeader, Card, InputSearchContainer, ErrorContainer,
} from './styles';
import Loader from '../../components/Loader';
import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import sad from '../../assets/images/sad.svg';
import ContactsServices from '../../services/ContactsServices';
import Button from '../../components/Button';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()))), [contacts, searchTerm]);

  async function loadContacts() {
    try {
      setIsLoading(true);
      const contactsList = await ContactsServices.listContacts(sortOrder);
      setHasError(false);
      setContacts(contactsList);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(
    () => {
      loadContacts();
    },
    [sortOrder],
  );

  function handleSort() {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }
  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value);
  }
  function handleTryAgain() {
    loadContacts();
  }
  return (
    <Container>
      <Loader isLoading={isLoading} />
      <InputSearchContainer>
        <input type="text" value={searchTerm} onChange={handleChangeSearchTerm} placeholder="Pesquisar contato" />
      </InputSearchContainer>

      <Header hasError={hasError}>
        { !hasError
        && (
        <strong>
          {filteredContacts.length}
          {filteredContacts.length === 1 ? ' contato' : ' contatos'}
        </strong>
        )}

        <Link to="/new">Novo contato</Link>
      </Header>
      {
        hasError && (
        <ErrorContainer>
          <img src={sad} alt="sad" />
          <div className="details">
            <strong>Ocorreu um erro ao obter os seus contatos</strong>
            <Button onClick={handleTryAgain}>Tentar novamente</Button>
          </div>
        </ErrorContainer>
        )
      }
      {!hasError && (
      <>
        {filteredContacts.length > 1 && (
        <ListHeader sortOrder={sortOrder}>
          <header>
            <button onClick={handleSort} type="button" className="sort-button">
              <span>
                Nome
              </span>
              <img src={arrow} alt="Arrow" />
            </button>
          </header>
        </ListHeader>
        )}
        {/* map returns new array  */}

        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <div className="info">
              <div className="contact-name">
                <strong>{contact.name}</strong>
                {contact.category_name && <small>{contact.category_name}</small>}
              </div>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>
            </div>
            <div className="actions">
              <Link to={`/edit/${contact.id}`}>
                <img src={edit} alt="Edit" />
              </Link>
              <button type="button">
                <img src={trash} alt="Delete" />
              </button>
            </div>
          </Card>
        ))}
      </>
      )}

    </Container>
  );
}
