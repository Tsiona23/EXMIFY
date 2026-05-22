export default function StatCard({ title, value }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-soft border border-beige dark:border-dark transition-all hover:-translate-y-1 hover:shadow-lg group">
      <h3 className="text-primary/70 dark:text-beige/70 text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-3xl font-bold text-primary dark:text-beige mt-2 tracking-tight">
        {value}
      </p>
    </div>
  );
}