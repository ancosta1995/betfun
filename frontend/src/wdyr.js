import React from 'react';

// Só ativa WDYR em desenvolvimento E quando necessário para debug
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_WDYR === 'true') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false, // Mudado para false para melhor performance
    trackHooks: true,
    trackExtraHooks: [
      [require('react-redux/lib'), 'useSelector', 'useDispatch'],
    ],
  });
}