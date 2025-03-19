
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="page-transition"
        unmountOnExit
      >
        <div className="page-wrapper">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
