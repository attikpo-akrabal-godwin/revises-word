import { BarChart3, BookOpen, FileText, Users } from "lucide-react";
import { use, useEffect, useState } from "react";
import { NavLink } from "react-router";
import data from "../assets/curentFile.json";
const nbrOfPostion = 4



export default function GridMenu() {
    const [curentPosition, setcurentPosition] = useState(1)
    useEffect(() => {
        if (!localStorage.getItem("db")) {
            localStorage.setItem("db", JSON.stringify(data));
        }

        const lastestPosition = localStorage.getItem("latestPosition")

        if (!lastestPosition) {
            localStorage.setItem("latestPosition", "1");
        }else{
            setcurentPosition(parseInt(lastestPosition))
        }
    }, []);

    const changeCurentPositions = (position:number)=>{
        setcurentPosition(position)
        localStorage.setItem("latestPosition", position.toString());
    }


    const menuItems = [
        /*  { title: "Dashboard", icon: Home, url: "/" }, */
        { title: "Vocabulary", icon: BookOpen, url: "/revise" },
        { title: "Dictionary", icon: FileText, url: "/dictionary" },
        { title: "Match  meanings", icon: Users, url: "/match" },
        { title: "Word sentences", icon: BarChart3, url: "/sentences" },
        /* 
          
         { title: "Documents", icon: FileText },
         { title: "Settings", icon: Settings }, */
    ];
    return (
        <div className=" bg-gray-100 p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-10">Application Menu</h1>
                <div className="flex justify-center mb-7">
                    <div className=" border-gray-300 px-6 py-3 rounded-xl  ">
                        position
                    </div>
                    <div className="flex gap-4 items-center">

                        {
                            Array.from({ length: nbrOfPostion }, (_, index) => (
                                <button
                                    key={index}
                                    className={`${curentPosition === index + 1 ?
                                        'bg-blue-500 text--500' :
                                        'bg-gray-300 text-white'
                                        } px-6 py-3 rounded-xl`}
                                    onClick={()=>{
                                        changeCurentPositions(index + 1)
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))
                        }



                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink to={item.url} end>
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 flex flex-col items-center justify-center hover:-translate-y-1"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                                        <Icon size={28} />
                                    </div>

                                    <p className="mt-4 font-semibold text-gray-700 group-hover:text-blue-600 transition">
                                        {item.title}
                                    </p>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
