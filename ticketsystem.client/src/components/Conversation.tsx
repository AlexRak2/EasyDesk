import { Message } from "../utils/Interfaces";
import RichTextDisplay from "./RichTextDisplay";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const Conversation = (props: { message: Message }) => {

  dayjs.extend(relativeTime);

  return (
    <div className={`text-black w-full bg-gray-200 p-4 rounded flex-flex shadow ${props.message.adminOnly ? "border-2 border-orange-200" : "border-2 border-brand-100 "} shadow-gray-400`}>
      <div className="flex flex-row gap-4 mb-5">
        <div className="w-[50px] h-[50px] bg-slate-300 rounded-full flex"><div className="m-auto text-3xl text-brand-400 ">{props.message.owner.email[0].toUpperCase()}</div></div>
        <div className="h-fit w-full">
          <h1 className="text-brand-700 text-lg">
            {props.message.owner?.email}
          </h1>
          <div className="text-gray-400 text-sm flex">
            {`Sent ${
              dayjs().to(dayjs(props.message.createdAt))
            }`}
          </div>
          
        </div>
        <span className="text-gray-600 text-sm w-[100px]">{props.message.adminOnly ? "Admin Only" : ""}</span>
      </div>
      <RichTextDisplay content={props.message.content} styling="" />
    </div>
  );
};

export default Conversation;
