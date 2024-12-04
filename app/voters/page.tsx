import Link from 'next/link';

export default function Component() {
  const events = [
    {
      id: 1,
      title: "Can Bitcoin Reach $100,000 By The End Of December 2025?",
      status: "active",
      createdOn: "Nov 4th, 2024",
      volume: "5000k",
      treaders: "345",
      totalVotes: "34634"
    },
    {
      id: 2,
      title: "BJP To Get More Than 300 Seats In The 2024 Elections?",
      status: "active",
      createdOn: "Nov 4th, 2024",
      volume: "5000k",
      treaders: "345",
      totalVotes: "34634"
    },
    {
      id: 3,
      title: "Will South Indian Films Dominate Bollywood At The Box Office This Year?",
      status: "active",
      createdOn: "Nov 4th, 2024",
      volume: "5000k",
      treaders: "345",
      totalVotes: "34634"
    },
    {
      id: 4,
      title: "Will South Indian Films Dominate Bollywood At The Box Office This Year?",
      status: "ended",
      createdOn: "Nov 4th, 2024",
      volume: "5000k",
      treaders: "345",
      totalVotes: "34634"
    },
    {
      id: 5,
      title: "Is SRK's Next Film Expected To Hit ₹500 Crore?",
      status: "ended",
      createdOn: "Nov 4th, 2024",
      volume: "5000k",
      treaders: "345",
      totalVotes: "34634"
    }
  ];

  return (
    <div className="min-h-screen bg-darkbg text-ow1 dm-sans flex items-center justify-center py-10">
      <div className="w-full max-w-5xl px-4">
        <div className="rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1F2133] px-6 py-4 grid grid-cols-[3fr_1fr_1fr_1fr] text-[#89A2ED] text-sm">
            <div>Events</div>
            <div className="text-right">Volume</div>
            <div className="text-right">Treaders</div>
            <div className="text-right">Total Votes</div>
          </div>

          {/* Content */}
          <div className="bg-transparent shadow-none">
            {events.map((event) => (
              <Link key={event.id} href={`/voters/event/${event.id}`} passHref>
                <div className="grid grid-cols-[3fr_1fr_1fr_1fr] items-start gap-4 px-6 py-4 border-b border-[#2A2A36] last:border-b-0 cursor-pointer hover:bg-[#2A2A36]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          event.status === "active"
                            ? "bg-[#0F2E1A] text-[#4ADE80]"
                            : "bg-[#331717] text-[#F87171]"
                        }`}
                      >
                        {event.status === "active" ? "Active" : "Ended"}
                      </span>
                      <span className="text-xs text-[#8B8BB5]">
                        Created On: {event.createdOn}
                      </span>
                    </div>
                    <h3 className="font-medium leading-tight">{event.title}</h3>
                  </div>
                  <div className="text-right">{event.volume}</div>
                  <div className="text-right">{event.treaders}</div>
                  <div className="text-right">{event.totalVotes}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
