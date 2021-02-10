const isAuthenticated = async () => {
  if (!localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    let option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await fetch('user/dashboard', option);
  }
};
document.addEventListener('DOMContentLoaded', isAuthenticated);
