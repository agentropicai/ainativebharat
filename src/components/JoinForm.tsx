import { useState } from 'react';

export default function JoinForm() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi, I'm ${name}. I want to become AI Native. #AINativeBharat`
    );
    window.open(`https://wa.me/919001236554?text=${message}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="join" className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className="font-heading text-xl text-white font-bold mb-2">
            You're in.
          </p>
          <p className="text-subtle text-sm">
            Ashish will connect with you on WhatsApp.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="join" className="py-16 px-6">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-saffron/50 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-saffron text-dark font-semibold rounded-lg hover:bg-saffron-light transition-colors whitespace-nowrap"
          >
            Join the tree
          </button>
        </form>
        <p className="text-xs text-muted text-center mt-3">
          Opens a WhatsApp chat to get you started.
        </p>
      </div>
    </section>
  );
}
