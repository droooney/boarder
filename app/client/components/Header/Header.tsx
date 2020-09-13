import React from 'react';
import { Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import block from 'bem-cn';

import Box from 'client/components/common/Box/Box';

const Root = styled(Container)`
  .Header {
    &__login {
      margin-left: auto;
    }

    &__registration {
      margin-left: 8px;
    }
  }
`;

const b = block('Header');

const Header: React.FC = () => {
  return (
    <Root className={b()}>
      <Box py={12} flex alignItems="center">
        <Link to="/">
          <Box size="xxl" bold>Boarder</Box>
        </Link>

        <Link
          to="/login"
          className={b('login').toString()}
        >
          Вход
        </Link>

        <Link
          to="/registration"
          className={b('registration').toString()}
        >
          Регистрация
        </Link>
      </Box>
    </Root>
  );
};

export default React.memo(Header);
