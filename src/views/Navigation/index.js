import React, { Fragment, Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import './index.css';
import { ReactComponent as Accueil } from '../../images/nav/accueil.svg';
import { ReactComponent as Social } from '../../images/nav/social.svg';
import { ReactComponent as Defis } from '../../images/nav/defis.svg';
import { ReactComponent as Classement } from '../../images/nav/classement.svg';
import { ReactComponent as Profil } from '../../images/nav/profil.svg';

const MENU = [
  { route: ROUTES.NEWSFEED, Logo: Accueil, title: "Accueil" },
  { route: ROUTES.SOCIAL, Logo: Social, title: "Social" },
  { route: ROUTES.CHALLENGES, Logo: Defis, title: "Défis" },
  { route: ROUTES.RANKING, Logo: Classement, title: "Classement" },
  { route: ROUTES.PROFILE, Logo: Profil, title: "Profil" }
];

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state= {
      //prevScrollpos: window.pageYOffset,
      visible: true,
      selected: MENU.findIndex(({ route }) => props.history.location.pathname.includes(route))
    };
    
    //this.handleScroll = this.handleScroll.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /* The following function keeps track of the scrolling position that is used to display/hide the navbar
  handleScroll() {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible
    });
  }

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll);
  }*/
  
  componentDidUpdate(props) {
    const newSelected = MENU.findIndex(({ route }) => props.history.location.pathname.includes(route));
    console.log(props.history.location.pathname)
    console.log(MENU)
    if (this.state.selected !== newSelected) {
      //this.setState({ selected: MENU.findIndex(({ route }) => route === props.history.location.pathname)});
    }
  }
  
  /*componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }*/

  handlePageChange(index) {
    this.setState({ selected: index });
  }

  render() {
    return (
      <div className="navBar d-flex justify-content-around align-items-center">
        <Fragment>
            {MENU.map((props, key) => (
              <NavItem {...props} selected={this.state.selected === key} key={key} index={key} handlePageChange={this.handlePageChange} />
            ))}
        </Fragment>
      </div>
    );
  }
}

const NavItem = ({ route, Logo, title, selected, index, handlePageChange }) => (
  <Link to={route} onClick={() => handlePageChange(index)} style={{ textDecoration: "none", cursor: "pointer" }}>
    <div className="d-flex flex-column align-items-center">
      <Logo className={selected ? "navIconSelected" : "navIcon"} />
      <span style={{ color: selected ? "#6EC8DE" : "#5C747B", fontSize: "0.7em" }}>{title}</span>
    </div>
  </Link>
);

export default withRouter(Navigation);