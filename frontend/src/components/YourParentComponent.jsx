import { connect } from 'react-redux';
import { toggleChat } from '../actions/chatActions';

const YourParentComponent = ({ isChatOpen }) => {
  return (
    <div>
      {isChatOpen && <Header />}
      {/* other components */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isChatOpen: state.chat.isOpen
});

export default connect(mapStateToProps, { toggleChat })(YourParentComponent); 