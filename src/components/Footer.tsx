'use client';

const footerLinks = {
  Services: [
    { label: 'Sports Injury', href: '#' },
    { label: 'Back Pain', href: '#' },
    { label: 'Shoulder Pain', href: '#' },
    { label: 'Knee Pain', href: '#' },
    { label: 'Stroke Rehab', href: '#' },
    { label: 'Women\'s Health', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Our Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="mx-3 mb-3 rounded-[10px] bg-vivavive-offwhite">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-6 font-sans text-sm font-semibold tracking-tight text-vivavive-dark">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm text-vivavive-muted transition-colors duration-200 hover:text-vivavive-dark"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-6 font-sans text-sm font-semibold tracking-tight text-vivavive-dark">
              Contact
            </h4>
            <div className="flex flex-col gap-3 font-sans text-sm text-vivavive-muted">
              <p>123 Wellness Avenue</p>
              <p>Medical District, NY 10001</p>
              <a
                href="tel:+18005550123"
                className="transition-colors duration-200 hover:text-vivavive-dark"
              >
                +1 (800) 555-0123
              </a>
              <a
                href="mailto:hello@vivavive.com"
                className="transition-colors duration-200 hover:text-vivavive-dark"
              >
                hello@vivavive.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-8 border-t border-vivavive-light pt-8 md:flex-row md:items-center">
          <p className="font-sans text-xs text-vivavive-muted">
            &copy; {new Date().getFullYear()} VivaVive Health. All rights reserved.
          </p>
          <p className="font-serif text-6xl font-normal tracking-tight text-vivavive-dark/10 md:text-8xl">
            VivaVive
          </p>
        </div>
      </div>
    </footer>
  );
}
