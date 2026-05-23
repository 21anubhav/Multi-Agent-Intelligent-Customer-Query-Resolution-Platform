import os

# Disable TensorFlow usage inside transformers
os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["USE_TF"] = "0"

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_community.document_loaders import (
    PyPDFLoader
)

from langchain_community.vectorstores import (
    Chroma
)

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

DB_PATH = "chroma_db"

DOCS_PATH = "docs"

# HuggingFace Embedding Model
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def build_rag():

    documents = []

    # Check docs folder exists
    if not os.path.exists(DOCS_PATH):

        print("Docs folder not found")
        return

    # Load all PDFs
    for file in os.listdir(DOCS_PATH):

        if file.endswith(".pdf"):

            pdf_path = os.path.join(
                DOCS_PATH,
                file
            )

            loader = PyPDFLoader(pdf_path)

            documents.extend(
                loader.load()
            )

    # Check if PDFs loaded
    if not documents:

        print("No PDF documents found")
        return

    # Split text into chunks
    splitter = RecursiveCharacterTextSplitter(

        chunk_size=500,

        chunk_overlap=50
    )

    chunks = splitter.split_documents(
        documents
    )

    # Create Vector Database
    vectordb = Chroma.from_documents(

        documents=chunks,

        embedding=embedding,

        persist_directory=DB_PATH
    )

    vectordb.persist()

    print("RAG DATABASE CREATED SUCCESSFULLY")


def search_rag(query):

    # Load existing DB
    vectordb = Chroma(

        persist_directory=DB_PATH,

        embedding_function=embedding
    )

    results = vectordb.similarity_search(

        query,

        k=3
    )

    return results