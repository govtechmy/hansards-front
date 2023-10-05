
/**
 * Calendar Card
 * @overview Status: In-development
 */

interface CalendarCardProps {
  date: string;
}

const CalendarCard = ({ date }: CalendarCardProps) => {
  const _date = new Date(date).toDateString().split(" ");

  return (
    <>
      <div className="shadow-button p-1.5 flex-col flex justify-center text-center w-[70px] border border-slate-200 dark:border-zinc-700 rounded-md">
        <span className="text-xs uppercase text-[#AE2929]">{_date[1]}</span>
        <span className="font-semibold text-xl text-zinc-900 dark:text-white">
          {_date[2]}
        </span>
        <span className="text-xs text-dim">{_date[3]}</span>
      </div>
    </>
  );
};

export default CalendarCard;
