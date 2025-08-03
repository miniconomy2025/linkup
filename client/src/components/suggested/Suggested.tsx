const mockSuggested = [
    {
        id: '11',
        username: 'Tebogo',
        avatar:
            'https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        followedBy: ['Chris_123', 'Ron_321'],
    },
    {
        id: '12',
        username: 'Tiya',
        avatar:
            'https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        followedBy: ['Chris_123', 'Ron_321'],
    },
    {
        id: '13',
        username: 'Ron',
        avatar:
            'https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        followedBy: ['Chris_123', 'Ron_321'],
    },
    {
        id: '14',
        username: 'Rivo',
        avatar:
            'https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        followedBy: ['Chris_123', 'Ron_321'],
    },
    {
        id: '15',
        username: 'Chris',
        avatar:
            'https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        followedBy: ['Chris_123', 'Ron_321'],
    },
];

export const Suggested = () => {
    return (
        <div className='suggested-container'>
            <div className='suggested-title'>Suggested for you</div>
            {mockSuggested.map((suggested) => (
                <div key={suggested.id} className='suggested-info-container'>
                    <img
                        src={suggested.avatar}
                        width={40}
                        height={40}
                        alt='avatar'
                        className='suggested-avatar'
                    />
                    <div className='suggested-name-container'>
                        <div className='suggested-name'>{suggested.username}</div>
                        <div className='suggested-followed-by'>
                            Followed by {suggested.followedBy[0]} + {suggested.followedBy.length}
                        </div>
                    </div>

                    <button className='suggested-follow'>Follow</button>
                </div>
            ))}
        </div>
    );
};