/* =========================================================
   Projekt: Wypożyczalnia samochodów
   Autor: Maksym Andrushchenko
   ========================================================= */

-- ======================
-- RESET STRUKTURY
-- ======================

DROP TABLE IF EXISTS wypozyczenia CASCADE;
DROP TABLE IF EXISTS platnosci CASCADE;
DROP TABLE IF EXISTS samochody CASCADE;
DROP TABLE IF EXISTS klienci CASCADE;
DROP TABLE IF EXISTS pracownicy CASCADE;

-- ======================
-- TABELE
-- ======================

-- KLIENCI
CREATE TABLE klienci (
    id SERIAL PRIMARY KEY,
    imie VARCHAR(50) NOT NULL,
    nazwisko VARCHAR(50) NOT NULL,
    telefon VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    pesel VARCHAR(11),
    zdjecie_prawa_jazdy TEXT
);

-- SAMOCHODY
CREATE TABLE samochody (
    id SERIAL PRIMARY KEY,
    marka VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    rocznik INT,
    nr_rejestracyjny VARCHAR(20) UNIQUE NOT NULL,
    dostepnosc BOOLEAN DEFAULT true
);

-- PRACOWNICY
CREATE TABLE pracownicy (
    id SERIAL PRIMARY KEY,
    imie VARCHAR(50) NOT NULL,
    nazwisko VARCHAR(50) NOT NULL,
    stanowisko VARCHAR(50)
);

-- PŁATNOŚCI
CREATE TABLE platnosci (
    id SERIAL PRIMARY KEY,
    metoda VARCHAR(30),
    kwota NUMERIC(10,2),
    status VARCHAR(20)
);

-- WYPOŻYCZENIA
CREATE TABLE wypozyczenia (
    id SERIAL PRIMARY KEY,
    id_klienta INT NOT NULL REFERENCES klienci(id),
    id_samochodu INT NOT NULL REFERENCES samochody(id),
    id_pracownika INT REFERENCES pracownicy(id),
    id_platnosci INT REFERENCES platnosci(id),
    data_wypozyczenia DATE NOT NULL,
    data_zwrotu DATE,
    cena NUMERIC(10,2)
);

-- ======================
-- TRIGGER: dostępność auta
-- ======================

CREATE OR REPLACE FUNCTION fn_update_dostepnosc_samochodu()
RETURNS TRIGGER AS $$
BEGIN
    -- nowo wypożyczone auto
    IF TG_OP = 'INSERT' THEN
        UPDATE samochody
        SET dostepnosc = false
        WHERE id = NEW.id_samochodu;
        RETURN NEW;
    END IF;

    -- zakończenie wypożyczenia (UPDATE data_zwrotu)
    IF TG_OP = 'UPDATE' THEN
        -- tylko jeśli wcześniej było NULL
        IF OLD.data_zwrotu IS NULL AND NEW.data_zwrotu IS NOT NULL THEN
            UPDATE samochody
            SET dostepnosc = true
            WHERE id = NEW.id_samochodu;
        END IF;
        RETURN NEW;
    END IF;

    -- usunięcie wypożyczenia (opcjonalnie)
    IF TG_OP = 'DELETE' THEN
        UPDATE samochody
        SET dostepnosc = true
        WHERE id = OLD.id_samochodu;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS tr_wypozyczenia_dostepnosc ON wypozyczenia;

CREATE TRIGGER tr_wypozyczenia_dostepnosc
AFTER INSERT OR UPDATE OR DELETE ON wypozyczenia
FOR EACH ROW
EXECUTE FUNCTION fn_update_dostepnosc_samochodu();

-- ======================
-- DANE STARTOWE (SEED)
-- ======================

INSERT INTO klienci (imie, nazwisko, telefon, email)
VALUES ('Maksym', 'Andrushchenko', '731237925', 'maksym@test.pl');

INSERT INTO samochody (marka, model, rocznik, nr_rejestracyjny)
VALUES
('Toyota', 'Corolla', 2020, 'WA12345'),
('Skoda', 'Octavia', 2019, 'KR98765');

INSERT INTO pracownicy (imie, nazwisko, stanowisko)
VALUES ('Jan', 'Kowalski', 'Recepcjonista');

INSERT INTO platnosci (metoda, kwota, status)
VALUES ('Karta', 500.00, 'OPLACONE');

INSERT INTO wypozyczenia (
    id_klienta,
    id_samochodu,
    id_pracownika,
    id_platnosci,
    data_wypozyczenia,
    cena
)
VALUES (
    1, 1, 1, 1, CURRENT_DATE, 500.00
);
