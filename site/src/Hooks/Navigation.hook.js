import { useDispatch, useSelector } from 'react-redux';
import { goBack, push } from 'connected-react-router';

export const useNavigation = () => {
  const location = useSelector(state => state.router.location);
  const dispatch = useDispatch();

  const navigate = url => dispatch(push(url));

  const pop = () => dispatch(goBack());

  return [location, navigate, pop];
};
