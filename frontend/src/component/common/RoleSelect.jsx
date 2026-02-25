const RoleSelect = ({ onChange }) => {
  return (
    <select
      name="role"
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="student">Student</option>
      <option value="mentor">Mentor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

export default RoleSelect;
