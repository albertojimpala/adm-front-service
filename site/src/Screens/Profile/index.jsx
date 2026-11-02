import { ScreenHeader } from '../../Components/Atoms/ScreenHeader';
import { UserProfile } from '../../Components/Profile/UserProfile';

export const ProfileScreen = () => (
  <div>
    <ScreenHeader title="Mi perfil" />
    <UserProfile />
  </div>
);
