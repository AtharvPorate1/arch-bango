import Image from "next/image"

interface TimelineItem {
  label: string
  timestamp: string
  completed: boolean
}

interface EventData {
  id: string
  title: string
  image: string
  description: string
  status: "active" | "ended"
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  resolveText: string
  votes: {
    yes: {
      percentage: number
      count: string
    }
    no: {
      percentage: number
      count: string
    }
  }
  timeline: TimelineItem[]
}

function EventHeader({ event }: { event: EventData }) {
  return (
    <div className="flex gap-6 bg-darkbg2 dm-sans rounded-lg p-6">
      <div className="w-32 h-32 bg-[#4C2E82] rounded-lg flex-shrink-0">
        <Image
          src={event.image}
          alt=""
          width={128}
          height={128}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl dm-sans text-ow1 font-medium">{event.title}</h1>
        <p className=" text-ow1 leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-4">
          <span className="px-2 py-0.5 rounded text-xs bg-[#05892C] text-white">
            {event.status === "active" ? "Active" : "Ended"}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4C2E82]">
              <Image src={event.author.avatar} alt="" width={24} height={24} className="rounded-full" />
            </div>
            <span className="text-[#F97316] text-sm">By {event.author.name}</span>
          </div>
          <span className="text-[#F97316] text-sm">Created On: {event.createdAt}</span>
        </div>
      </div>
    </div>
  )
}

function VotingStatus({ votes }: { votes: EventData["votes"] }) {
  return (
    <div className="bg-transparent shadow-none  rounded-lg p-6">
      <h2 className="text-xl font-medium mb-6">Current Votes</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="bg-black px-3 py-1 rounded">
            <span className="text-[#05892C]">YES {votes.yes.percentage}¢</span>
          </div>
          <div className="bg-black px-3 py-1 rounded">
            <span className="text-[#EF4444]">NO {votes.no.percentage}¢</span>
          </div>
        </div>
        <div className="h-1.5 bg-[#2A2A36] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#05892C] to-[#EF4444]"
            style={{
              width: `${votes.yes.percentage + votes.no.percentage}%`
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#05892C]" />
            <span>Yes</span>
            <span className="text-[#8B8BB5] ml-auto">{votes.yes.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#EF4444]" />
            <span>No</span>
            <span className="text-[#8B8BB5] ml-auto">{votes.no.count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Timeline({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <div className="mt-8 bg-darkbg2">
      <h2 className="text-xl font-medium mb-6">Event Status</h2>
      <div className="relative">
        {timeline.map((item, index) => (
          <div key={index} className="flex gap-4 items-start mb-8 last:mb-0">
            <div className="relative">
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  item.completed ? "border-[#05892C] bg-[#05892C]" : "border-[#2A2A36] bg-transparent"
                }`}
              />
              {index !== timeline.length - 1 && (
                <div className="absolute top-5 left-2.5 w-[1px] h-12 bg-[#2A2A36]" />
              )}
            </div>
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-[#8B8BB5]">{item.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Component() {
  const eventData: EventData = {
    id: "1",
    title: "Can Bitcoin Reach $100,000 By The End Of 2025?",
    image: "/placeholder.svg?height=128&width=128",
    description: "Lorem Ipsum Dolor Sit Amet Consectetur. Diam Sit Eros In Amet Gravida Porta Nisl. Leo Lorem Ut Quam Eu Duis Morbi Lore Ultricies. Risus Arcu Egestas Volutpat Libero. Libero Hac Nisl Id Quis Sapien Morbi Consequat Odio.",
    status: "active",
    author: {
      name: "Cryptoknight23",
      avatar: "/placeholder.svg?height=24&width=24"
    },
    createdAt: "Nov4th, 2024",
    resolveText: "Lorem Ipsum Dolor Sit Amet Consectetur. In Viverra Congue Adipiscing In Lacus. Sed Et Ut Mi Tellus. Eleifend Vitae Facilisi Suspendisse Ornare Convallis Ut Ultrices Mattis Augue. Risus Sit Cursus Vestibulum Commodo Pharetra Id Molestie. Adipiscing Lectus Porttitor Semper Massa Urna Sit Blandit Nisl Adipiscing. Sed Pellentesque Amet Sed Tortor Risus Blandit Nulla. Est Blandit Elementum Vel Mauris At Scelerisque Egestas Purus. In Sed Dolor Blandit Enim Ultricies Elit Tristique Malesuada. Bibendum Urna Lectus Id Magna Facilisis Cursus Sit Habitant.",
    votes: {
      yes: {
        percentage: 45.1,
        count: "800K"
      },
      no: {
        percentage: 25.7,
        count: "200K"
      }
    },
    timeline: [
      {
        label: "Event Created",
        timestamp: "Nov 14th, 01:34PM",
        completed: true
      },
      {
        label: "Published On Chain",
        timestamp: "Nov 14th, 01:34PM",
        completed: true
      },
      {
        label: "Voting Period Started",
        timestamp: "Nov 14th, 01:34PM",
        completed: true
      },
      {
        label: "Voting Period Enden",
        timestamp: "Nov 14th, 01:34PM",
        completed: true
      },
      {
        label: "Results",
        timestamp: "Nov 14th, 01:34PM",
        completed: false
      }
    ]
  }

  return (
    <div className="min-h-screen bg-darkbg text-white dm-sans py-10">
      <div className="mx-auto w-4/5 max-w-7xl">
        <div className="space-y-8">
          <EventHeader event={eventData} />
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-medium mb-4">Description</h2>
                <p className="text-[#8B8BB5] leading-relaxed">{eventData.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Resolve</h2>
                <p className="text-[#8B8BB5] leading-relaxed">{eventData.resolveText}</p>
              </div>
            </div>

            <div className="space-y-8 p-2 bg-darkbg2">
              <VotingStatus votes={eventData.votes} />
              <Timeline timeline={eventData.timeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}