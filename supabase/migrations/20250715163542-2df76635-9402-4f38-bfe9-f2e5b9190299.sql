
-- Create invoices table to store invoice data
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table to track Stripe payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'canceled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access to invoices (for payment portal)
CREATE POLICY "Public can view invoices for payment" ON public.invoices
  FOR SELECT
  USING (true);

-- Create policies to allow public read access to payments
CREATE POLICY "Public can view payments" ON public.payments
  FOR SELECT
  USING (true);

-- Create policies for edge functions to insert/update
CREATE POLICY "Edge functions can insert payments" ON public.payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Edge functions can update payments" ON public.payments
  FOR UPDATE
  USING (true);

CREATE POLICY "Edge functions can update invoices" ON public.invoices
  FOR UPDATE
  USING (true);

-- Insert some sample invoices for testing
INSERT INTO public.invoices (invoice_number, customer_name, customer_email, amount, description, due_date) VALUES
('INV-001', 'Ahmed Al Mahmoud', 'ahmed@example.ae', 250.00, 'Website Development Services', '2024-01-15'),
('INV-002', 'Fatima Hassan', 'fatima@example.ae', 500.00, 'Mobile App Design', '2024-01-20'),
('INV-003', 'Mohammed Ali', 'mohammed@example.ae', 750.00, 'Digital Marketing Campaign', '2024-01-25'),
('INV-004', 'Sarah Abdullah', 'sarah@example.ae', 1000.00, 'E-commerce Platform Development', '2024-01-30');
