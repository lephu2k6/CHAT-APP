const NoChatSelected = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full  bg-gray-50 p-6 text-center ">
            <div className="mb-6 p-4 bg-white rounded-full shadow-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No conversation selected</h3>
            <p className="text-gray-500 max-w-md mb-6">
                Choose a chat from the sidebar or start a new conversation to begin messaging
            </p>
        </div>
    );
};

export default NoChatSelected;