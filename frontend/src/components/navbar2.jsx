import React from 'react';

const NavLink = ({ href, target, rel, children }) => (
  <a href={href} target={target} rel={rel}>
    {children}
  </a>
);

const Icon = ({ children }) => (
  <div className="jss28">
    {children}
  </div>
);

const Header = () => {
  return (
    <div className="jss26" style={{
      height: '30px',
      display: 'flex',
      padding: '0 1rem',
      position: 'fixed', /* Change from 'relative' to 'fixed' */
      top: 0, /* Lock the header to the top of the viewport */
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#050614'
    }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="jss28" style={{ color: 'rgb(227, 200, 94)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none" style={{ height: '12px', width: '12px' }}>
            {/* SVG Path */}
          </svg>
          $1,000 Leaderboard
        </div>
        <div className="jss28">Affiliates</div>
        <div className="jss28">Fairness</div>
        <div className="jss28">Support</div>
        <div className="jss28">TOS</div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <NavLink href="https://twitter.com/FullsenddotGG" target="_blank" rel="noreferrer">
          <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ height: '14px', width: '14px' }}>
              {/* SVG Path */}
            </svg>
          </Icon>
        </NavLink>
        <NavLink href="https://discord.gg/j82fApKDRb" target="_blank" rel="noreferrer">
          <Icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ height: '14px', width: '14px' }}>
              {/* SVG Path */}
            </svg>
          </Icon>
        </NavLink>
        <div className="jss28" style={{ color: 'rgb(58, 137, 235)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style={{ height: '12px', width: '12px' }}>
            {/* SVG Path */}
          </svg>
          Free Coins
        </div>
        <div className="jss28" style={{ color: 'rgb(255, 64, 64)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ height: '12px', width: '12px' }}>
            {/* SVG Path */}
          </svg>
          Log Out
        </div>
      </div>
    </div>
  );
};

export default Header;
