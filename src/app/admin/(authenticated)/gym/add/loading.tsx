export default function GymStepperSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-32 bg-gray-300 rounded-md animate-pulse"></div>
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-10 w-full bg-gray-300 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <div className="h-10 w-24 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}
