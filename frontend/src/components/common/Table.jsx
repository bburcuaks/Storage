import './Table.css';

const Table = ({ children }) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        {children}
      </table>
    </div>
  );
};

export default Table;
