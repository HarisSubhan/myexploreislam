import React from 'react';
import  ColorChanging from '../../../components/parent/ColorChangeing'

const DefaultTheme = () => {
  const [active, setActive] = useState(null);
  
    const cards = [
      {
        key: "profile",
        title: "Profile",
        icon: <FaUser size={28} />,
        desc: "Manage your personal details",
      },
      {
        key: "password",
        title: "Password",
        icon: <FaLock size={28} />,
        desc: "Update your login credentials",
      },
    ];
  return (
    <>
      <ColorChanging/>
    </>
  );
};

export default DefaultTheme;
