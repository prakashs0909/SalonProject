import React from 'react';

const Filters = ({ filter, setFilter, resetFilters }) => {
    return (
        <div >
            <div className="mb-4 mt-16 pt-4">
                <input
                    type="text"
                    placeholder="Search by customer name or date"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md w-full fw-bold"
                />
            </div>
            <div className="mb-4">
                <select
                    value={filter.sort}
                    onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md w-full"
                >
                    <option value="">Sort by</option>
                    <option value="oldest">Oldest to Newest</option>
                    <option value="newest">Newest to Oldest</option>
                </select>
            </div>
            <div className="mb-4">
                <button
                    className={`p-2 border border-gray-300 rounded-md mr-2 ${filter.status === 'pending' ? 'bg-gray-300' : ''}`}
                    onClick={() => setFilter({ ...filter, status: 'pending' })}
                >
                    Pending
                </button>
                <button
                    className={`p-2 border border-gray-300 rounded-md ${filter.status === 'done' ? 'bg-gray-300' : ''}`}
                    onClick={() => setFilter({ ...filter, status: 'done' })}
                >
                    Done
                </button>
            </div>
            <div className="mb-4">
                <button
                    className="p-2 bg-blue-500 text-white rounded-md"
                    onClick={resetFilters}
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default Filters;
